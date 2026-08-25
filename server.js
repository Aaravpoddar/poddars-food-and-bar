import { createServer } from 'node:http';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const distDirectory = join(rootDirectory, 'dist');
const publicDirectory = join(rootDirectory, 'public');
const ordersFile = join(rootDirectory, 'data', 'orders.json');
const waiterCallsFile = join(rootDirectory, 'data', 'waiter_calls.json');
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
let flashSaleActive = true;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

async function serveStaticFile(response, pathname) {
  let targetPath = join(distDirectory, pathname === '/' ? 'index.html' : pathname);
  let content = null;
  let ext = '';

  // 1. Check in dist directory first
  try {
    const fileStat = await stat(targetPath);
    if (fileStat.isDirectory()) {
      targetPath = join(targetPath, 'index.html');
    }
    content = await readFile(targetPath);
    ext = extname(targetPath).toLowerCase();
  } catch {
    // 2. Fallback to public directory directly (fast direct image loading)
    try {
      const publicPath = join(publicDirectory, pathname);
      const pubStat = await stat(publicPath);
      if (!pubStat.isDirectory()) {
        content = await readFile(publicPath);
        ext = extname(publicPath).toLowerCase();
      }
    } catch {}
  }

  if (content) {
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const isImageOrFont = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.woff', '.woff2', '.ttf'].includes(ext);
    response.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Bypass-Tunnel-Reminder',
      'Cache-Control': ext === '.html'
        ? 'no-cache, no-store, must-revalidate'
        : isImageOrFont
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=86400'
    });
    return response.end(content);
  }

  // 3. If asset file (image, js, css) was not found, return 404 instead of serving index.html
  if (pathname.startsWith('/images/') || pathname.startsWith('/assets/') || pathname.includes('.')) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Asset not found');
  }

  // 4. SPA Fallback: serve index.html for React routing
  try {
    const indexContent = await readFile(join(distDirectory, 'index.html'));
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Bypass-Tunnel-Reminder',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    return response.end(indexContent);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return response.end(`
      <h2>THE PODDAR'S COURTYARD</h2>
      <p>Please build the frontend using <code>npm run build</code> or run with <code>npm run dev</code>.</p>
    `);
  }
}

function getLocalIpAddresses() {
  const interfaces = networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

// Connected SSE clients for live synchronization
const sseClients = new Set();

function broadcastEvent(eventType, data) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Active Staff Tracking System (Tracks multi-device active chefs/staff in real-time)
const activeStaffSessions = new Map(); // key: `${id}_${deviceId}`, val: { id, name, role, designation, lastSeen, deviceId }

function getActiveStaffList() {
  const now = Date.now();
  const seenStaff = new Map();
  for (const [key, session] of activeStaffSessions.entries()) {
    if (now - session.lastSeen < 60000) { // Active within last 60 seconds
      const normKey = String(session.id || session.name).toUpperCase();
      if (!seenStaff.has(normKey)) {
        seenStaff.set(normKey, {
          id: session.id,
          name: session.name,
          role: session.role || session.designation,
          designation: session.designation || session.role,
          lastSeen: session.lastSeen
        });
      }
    } else {
      activeStaffSessions.delete(key);
    }
  }
  return Array.from(seenStaff.values());
}

function updateStaffHeartbeat(staff, deviceId) {
  if (!staff || (!staff.id && !staff.name)) return getActiveStaffList();
  const key = deviceId ? `${staff.id || staff.name}_${deviceId}` : `${staff.id || staff.name}`;
  activeStaffSessions.set(key, {
    id: staff.id,
    name: staff.name,
    role: staff.role || staff.designation,
    designation: staff.designation || staff.role,
    deviceId: deviceId || 'default',
    lastSeen: Date.now()
  });
  const list = getActiveStaffList();
  broadcastEvent('staff:active', list);
  return list;
}

function removeStaffSession(staffId, deviceId) {
  let changed = false;
  for (const [key, session] of activeStaffSessions.entries()) {
    if ((deviceId && session.deviceId === deviceId) || (staffId && String(session.id).toUpperCase() === String(staffId).toUpperCase())) {
      activeStaffSessions.delete(key);
      changed = true;
    }
  }
  const list = getActiveStaffList();
  if (changed) {
    broadcastEvent('staff:active', list);
  }
  return list;
}

// Periodically clean up expired sessions and broadcast if count changed
setInterval(() => {
  const initialCount = activeStaffSessions.size;
  const list = getActiveStaffList();
  if (activeStaffSessions.size !== initialCount) {
    broadcastEvent('staff:active', list);
  }
}, 15000);

// Active Table Checkin & Occupancy Tracker
const activeTableCheckins = new Map(); // key: table, value: { table, guestName, checkinAt, deviceId }

async function getTablesOccupancy() {
  const orders = await getOrders();
  const occupied = {};
  const now = Date.now();

  // 1. Mark tables with unpaid dine-in orders as OCCUPIED until the bill is settled
  for (const o of orders) {
    const isRecent = o.createdAt ? (now - new Date(o.createdAt).getTime() < 12 * 60 * 60 * 1000) : false;
    const isNotCancelled = o.status !== 'Cancelled';
    if (o.mode === 'Dine in' && o.table && isNotCancelled && isRecent && o.paymentStatus !== 'Paid') {
      const t = o.table.trim();
      occupied[t] = {
        table: t,
        guestName: o.guestName || 'Guest',
        orderId: o.id,
        status: o.status,
        paymentStatus: o.paymentStatus || 'Unpaid',
        total: o.total || 0,
        createdAt: o.createdAt
      };
    }
  }

  // 2. Mark active check-ins (within last 45 mins)
  for (const [t, checkin] of activeTableCheckins.entries()) {
    if (now - checkin.checkinAt < 45 * 60 * 1000) {
      if (!occupied[t]) {
        occupied[t] = {
          table: t,
          guestName: checkin.guestName || 'Guest',
          orderId: checkin.orderId || null,
          status: 'Checked-in',
          paymentStatus: 'Unpaid',
          checkinAt: checkin.checkinAt
        };
      }
    } else {
      activeTableCheckins.delete(t);
    }
  }

  return occupied;
}

async function getOrders() {
  try {
    const content = await readFile(ordersFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveOrders(orders) {
  await mkdir(dirname(ordersFile), { recursive: true });
  await writeFile(ordersFile, JSON.stringify(orders, null, 2), 'utf8');
}

async function getWaiterCalls() {
  try {
    const content = await readFile(waiterCallsFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveWaiterCalls(calls) {
  await mkdir(dirname(waiterCallsFile), { recursive: true });
  await writeFile(waiterCallsFile, JSON.stringify(calls, null, 2), 'utf8');
}

function send(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}

function getStats(orders) {
  const now = new Date();
  const todayUtc = now.toISOString().slice(0, 10);
  
  const todaysOrders = orders.filter(o => {
    if (!o.createdAt) return false;
    if (o.createdAt.startsWith(todayUtc)) return true;
    const od = new Date(o.createdAt);
    return (
      od.getFullYear() === now.getFullYear() &&
      od.getMonth() === now.getMonth() &&
      od.getDate() === now.getDate()
    );
  });
  
  const pendingCount = orders.filter(o => o.status === 'New').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;
  const completedToday = todaysOrders.filter(o => o.status === 'Completed').length;
  const revenueToday = todaysOrders
    .filter(o => o.status === 'Completed' || o.status === 'Ready' || o.status === 'Preparing' || o.status === 'New')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return {
    pendingCount,
    preparingCount,
    readyCount,
    completedToday,
    revenueToday,
    totalOrders: orders.length
  };
}

const server = createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    return response.end();
  }

  const urlObj = new URL(request.url, `http://localhost:${port}`);
  const pathname = urlObj.pathname;

  try {
    // Health Check for Cloud Hosting / Render
    if (pathname === '/health' || pathname === '/api/health') {
      return send(response, 200, { status: 'healthy', timestamp: new Date().toISOString() });
    }

    // SSE Stream for Realtime Live Sync
    if (request.method === 'GET' && pathname === '/api/events') {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      response.write('retry: 3000\n\n');
      // Send immediate active staff list and table occupancy on connect
      response.write(`event: staff:active\ndata: ${JSON.stringify(getActiveStaffList())}\n\n`);
      getTablesOccupancy().then(occ => {
        try {
          response.write(`event: table:status\ndata: ${JSON.stringify(occ)}\n\n`);
        } catch {}
      });
      sseClients.add(response);

      request.on('close', () => {
        sseClients.delete(response);
      });
      return;
    }

    // GET /api/tables/status (Get real-time table occupancy status)
    if (request.method === 'GET' && pathname === '/api/tables/status') {
      const occ = await getTablesOccupancy();
      return send(response, 200, occ);
    }

    // POST /api/tables/checkin (Customer checks into a table)
    if (request.method === 'POST' && pathname === '/api/tables/checkin') {
      const payload = await readBody(request);
      const table = String(payload.table || '').trim();
      if (table) {
        activeTableCheckins.set(table, {
          table,
          guestName: String(payload.guestName || 'Guest').trim(),
          deviceId: payload.deviceId || 'default',
          checkinAt: Date.now()
        });
        const occ = await getTablesOccupancy();
        broadcastEvent('table:status', occ);
        return send(response, 200, { success: true, occupiedTables: occ });
      }
      return send(response, 400, { error: 'Table is required' });
    }

    // POST /api/tables/checkout (Table released/vacated)
    if (request.method === 'POST' && pathname === '/api/tables/checkout') {
      const payload = await readBody(request);
      const table = String(payload.table || '').trim();
      if (table) {
        activeTableCheckins.delete(table);
        const occ = await getTablesOccupancy();
        broadcastEvent('table:status', occ);
        return send(response, 200, { success: true, occupiedTables: occ });
      }
      return send(response, 400, { error: 'Table is required' });
    }

    // POST /api/tables/reset (Vacate / Log out / Free ALL tables)
    if (request.method === 'POST' && pathname === '/api/tables/reset') {
      activeTableCheckins.clear();
      const orders = await getOrders();
      orders.forEach(o => {
        if (o.mode === 'Dine in' && o.paymentStatus !== 'Paid') {
          o.paymentStatus = 'Paid';
          o.paidAt = new Date().toISOString();
        }
      });
      await saveOrders(orders);
      const occ = {};
      broadcastEvent('table:status', occ);
      return send(response, 200, { success: true, message: 'All tables logged out and available', occupiedTables: occ });
    }

    // GET /api/staff/active (Get list of active staff members logged in across all devices)
    if (request.method === 'GET' && pathname === '/api/staff/active') {
      return send(response, 200, getActiveStaffList());
    }

    // POST /api/staff/heartbeat (Keep-alive presence ping from active staff devices)
    if (request.method === 'POST' && pathname === '/api/staff/heartbeat') {
      const payload = await readBody(request);
      const staffObj = payload.staff || (payload.name || payload.staffId || payload.id ? { id: payload.staffId || payload.id, name: payload.name, role: payload.role || payload.designation } : null);
      const activeList = updateStaffHeartbeat(staffObj, payload.deviceId);
      return send(response, 200, { success: true, activeStaff: activeList });
    }

    // POST /api/staff/logout (Explicit staff logout notification)
    if (request.method === 'POST' && pathname === '/api/staff/logout') {
      const payload = await readBody(request);
      const activeList = removeStaffSession(payload.staffId || payload.id, payload.deviceId);
      return send(response, 200, { success: true, activeStaff: activeList });
    }

    // Kitchen Summary Stats
    if (request.method === 'GET' && pathname === '/api/stats') {
      const orders = await getOrders();
      return send(response, 200, getStats(orders));
    }

    // POST /api/chef/login (Chef Authentication)
    if (request.method === 'POST' && pathname === '/api/chef/login') {
      const payload = await readBody(request);
      const name = String(payload.name || '').trim();
      const chefId = String(payload.chefId || payload.id || '').trim().toUpperCase();

      if (!name || !chefId) {
        return send(response, 400, { error: 'Please provide both Chef Name and Staff ID.' });
      }

      // Strictly Authorized Leadership & Staff Team
      const authorizedChefs = [
        { name: 'AARAV', id: '1910', designation: 'Founder & Executive Chef', role: 'Founder & Executive Chef', idVariations: ['1910', 'CHEF 1910', 'CHEF1910', 'CHEF-1910', 'AARAV', 'AARAV PODDAR'] },
        { name: 'ANKIT', id: '1602', designation: 'Managing Director (MD)', role: 'Managing Director (MD)', idVariations: ['1602', 'MD 1602', 'MD1602', 'CHEF 1602', 'CHEF1602', 'CHEF-1602', 'ANKIT', 'ANKIT PODDAR'] },
        { name: 'EKTA', id: '0804', designation: 'Executive Director & COO', role: 'Executive Director & COO', idVariations: ['0804', 'COO 0804', 'COO0804', 'CHEF 0804', 'CHEF0804', 'CHEF-0804', 'ED 0804', 'EKTA', 'EKTA PODDAR'] },
        { name: 'VANISHA', id: '0101', designation: 'Head Chef & Kitchen Director', role: 'Head Chef & Kitchen Director', idVariations: ['0101', 'CHEF 0101', 'CHEF0101', '0101', 'CHEF-0101', 'VANISHA', 'VANISHA PODDAR'] }
      ];

      const normName = name.toUpperCase().replace(/^CHEF\s*/, '');
      const normId = chefId.toUpperCase().replace(/[\s-]/g, '').replace(/^(CHEF|MD|COO|ED)/, '');

      const matched = authorizedChefs.find(c => {
        const coreName = c.name.toUpperCase().replace(/^CHEF\s*/, '');
        const firstName = coreName.split(' ')[0];
        const nameMatch = normName === coreName || normName === firstName || normName === c.name.toUpperCase();
        const idMatch = c.idVariations.some(v => v.replace(/[\s-]/g, '').toUpperCase().replace(/^(CHEF|MD|COO|ED)/, '') === normId || v.replace(/[\s-]/g, '').toUpperCase() === chefId.toUpperCase().replace(/[\s-]/g, ''));
        return nameMatch && idMatch;
      });

      if (!matched) {
        return send(response, 401, {
          error: 'Sorry, member profile not found in authorized roster.',
          unauthorized: true
        });
      }

      const chefProfile = {
        id: matched.id,
        name: matched.name,
        role: matched.designation || matched.role,
        designation: matched.designation || matched.role,
        loggedInAt: new Date().toISOString()
      };

      // Register staff presence immediately upon login
      const activeList = updateStaffHeartbeat(chefProfile, payload.deviceId);

      return send(response, 200, {
        success: true,
        token: `kds_token_${Date.now()}_${matched.id.replace(/\s+/g, '')}`,
        chef: chefProfile,
        activeStaff: activeList
      });
    }

    // GET /api/orders (supports ?status=... &search=...)
    if (request.method === 'GET' && pathname === '/api/orders') {
      let orders = await getOrders();
      const statusFilter = urlObj.searchParams.get('status');
      const searchFilter = urlObj.searchParams.get('search');

      if (statusFilter && statusFilter !== 'All') {
        orders = orders.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());
      }
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        orders = orders.filter(o => 
          o.id.toLowerCase().includes(q) ||
          (o.table && o.table.toLowerCase().includes(q)) ||
          (o.guestName && o.guestName.toLowerCase().includes(q)) ||
          (o.items && o.items.some(i => i.name.toLowerCase().includes(q)))
        );
      }

      return send(response, 200, orders);
    }

    // GET /api/orders/:id
    const singleOrderMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (request.method === 'GET' && singleOrderMatch) {
      const orderId = singleOrderMatch[1];
      const orders = await getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) return send(response, 404, { error: 'Order not found.' });
      return send(response, 200, order);
    }

    // POST /api/orders (Place new order from customer)
    if (request.method === 'POST' && pathname === '/api/orders') {
      const payload = await readBody(request);
      if (!Array.isArray(payload.items) || payload.items.length === 0) {
        return send(response, 400, { error: 'An order needs at least one item.' });
      }

      const orders = await getOrders();
      const order = {
        id: `TP-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'New',
        createdAt: new Date().toISOString(),
        guestName: String(payload.guestName || '').trim().slice(0, 100) || 'Guest',
        mode: payload.mode === 'Self pickup' ? 'Self pickup' : 'Dine in',
        table: payload.mode === 'Dine in' ? (payload.table || 'Table 1') : null,
        items: payload.items.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          qty: Number(item.qty),
          color: item.color || 'coral',
          mark: item.mark || 'FD'
        })),
        instructions: String(payload.instructions || '').trim().slice(0, 500),
        subtotal: Number(payload.subtotal || 0),
        gst: Number(payload.gst || 0),
        total: Number(payload.total || 0),
        estimatedPrepTime: null,
        approvedAt: null,
        readyAt: null,
        completedAt: null,
        cancelledAt: null,
        chefNote: '',
        rejectionReason: null
      };

      orders.unshift(order);
      await saveOrders(orders);
      broadcastEvent('order:created', order);
      getTablesOccupancy().then(occ => broadcastEvent('table:status', occ));

      return send(response, 201, order);
    }

    // PATCH /api/orders/:id/pay (Customer or Chef settles/pays final bill for an order)
    const payMatch = pathname.match(/^\/api\/orders\/([^/]+)\/pay$/);
    if (request.method === 'PATCH' && payMatch) {
      const orderId = payMatch[1];
      const payload = await readBody(request);
      const orders = await getOrders();
      const order = orders.find(item => item.id === orderId);

      if (!order) return send(response, 404, { error: 'Order not found.' });

      order.paymentStatus = 'Paid';
      order.paidAt = new Date().toISOString();
      if (payload.paymentMethod) order.paymentMethod = String(payload.paymentMethod);
      if (payload.status) order.status = payload.status;
      if (order.table) activeTableCheckins.delete(order.table);

      await saveOrders(orders);
      broadcastEvent('order:updated', order);
      getTablesOccupancy().then(occ => broadcastEvent('table:status', occ));

      return send(response, 200, order);
    }

    // PATCH /api/orders/:id/approve (Chef approves order and sets prep time)
    const approveMatch = pathname.match(/^\/api\/orders\/([^/]+)\/approve$/);
    if (request.method === 'PATCH' && approveMatch) {
      const orderId = approveMatch[1];
      const payload = await readBody(request);
      const orders = await getOrders();
      const order = orders.find(item => item.id === orderId);

      if (!order) return send(response, 404, { error: 'Order not found.' });

      order.status = 'Preparing';
      order.approvedAt = new Date().toISOString();
      order.estimatedPrepTime = Number(payload.prepTime) || 15; // default 15 mins
      if (payload.approvedBy) order.approvedBy = String(payload.approvedBy).trim();
      if (payload.chefNote) order.chefNote = String(payload.chefNote).trim();

      await saveOrders(orders);
      broadcastEvent('order:updated', order);
      getTablesOccupancy().then(occ => broadcastEvent('table:status', occ));

      return send(response, 200, order);
    }

    // PATCH /api/orders/:id/reject (Chef rejects order)
    const rejectMatch = pathname.match(/^\/api\/orders\/([^/]+)\/reject$/);
    if (request.method === 'PATCH' && rejectMatch) {
      const orderId = rejectMatch[1];
      const payload = await readBody(request);
      const orders = await getOrders();
      const order = orders.find(item => item.id === orderId);

      if (!order) return send(response, 404, { error: 'Order not found.' });

      order.status = 'Cancelled';
      order.cancelledAt = new Date().toISOString();
      order.rejectionReason = payload.reason || 'Kitchen unable to fulfill order at this time.';
      if (order.table) activeTableCheckins.delete(order.table);

      await saveOrders(orders);
      broadcastEvent('order:updated', order);
      getTablesOccupancy().then(occ => broadcastEvent('table:status', occ));

      return send(response, 200, order);
    }

    // PATCH /api/orders/:id/status (General status change: Preparing, Ready, Completed, Cancelled)
    const statusMatch = pathname.match(/^\/api\/orders\/([^/]+)\/status$/);
    if (request.method === 'PATCH' && statusMatch) {
      const orderId = statusMatch[1];
      const payload = await readBody(request);
      const allowedStatuses = ['New', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

      if (!allowedStatuses.includes(payload.status)) {
        return send(response, 400, { error: 'Invalid status.' });
      }

      const orders = await getOrders();
      const order = orders.find(item => item.id === orderId);

      if (!order) return send(response, 404, { error: 'Order not found.' });

      order.status = payload.status;
      const now = new Date().toISOString();
      if (payload.status === 'Preparing' && !order.approvedAt) order.approvedAt = now;
      if (payload.status === 'Ready') order.readyAt = now;
      if (payload.status === 'Completed') order.completedAt = now;
      if (payload.status === 'Cancelled') {
        order.cancelledAt = now;
        if (order.table) activeTableCheckins.delete(order.table);
      }

      if (payload.paymentStatus) {
        order.paymentStatus = payload.paymentStatus;
        if (payload.paymentStatus === 'Paid') {
          order.paidAt = now;
          if (order.table) activeTableCheckins.delete(order.table);
        }
      }

      if (payload.prepTime) order.estimatedPrepTime = Number(payload.prepTime);
      if (payload.chefNote) order.chefNote = String(payload.chefNote).trim();

      await saveOrders(orders);
      broadcastEvent('order:updated', order);
      getTablesOccupancy().then(occ => broadcastEvent('table:status', occ));

      return send(response, 200, order);
    }

    // DELETE /api/orders/:id
    const deleteMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (request.method === 'DELETE' && deleteMatch) {
      const orderId = deleteMatch[1];
      let orders = await getOrders();
      const initialLength = orders.length;
      orders = orders.filter(item => item.id !== orderId);

      if (orders.length === initialLength) {
        return send(response, 404, { error: 'Order not found.' });
      }

      await saveOrders(orders);
      broadcastEvent('order:deleted', { id: orderId });
      getTablesOccupancy().then(occ => broadcastEvent('table:status', occ));
      return send(response, 200, { success: true, message: 'Order removed' });
    }

    // ==========================================
    // WAITER CALL NOTIFICATIONS (KITCHEN PORTAL)
    // ==========================================

    // GET /api/waiter-calls
    if (request.method === 'GET' && pathname === '/api/waiter-calls') {
      const calls = await getWaiterCalls();
      return send(response, 200, calls);
    }

    // POST /api/waiter-calls (Customer calls waiter)
    if (request.method === 'POST' && pathname === '/api/waiter-calls') {
      const payload = await readBody(request);
      const calls = await getWaiterCalls();
      
      const newCall = {
        id: `CALL-${Math.floor(1000 + Math.random() * 9000)}`,
        table: String(payload.table || 'Table 1').trim(),
        guestName: String(payload.guestName || 'Guest').trim(),
        reason: String(payload.reason || 'General Assistance').trim(),
        customNote: String(payload.customNote || '').trim(),
        status: 'Pending', // 'Pending' | 'Attended' | 'Dismissed'
        createdAt: new Date().toISOString(),
        attendedAt: null,
        attendedBy: null
      };

      calls.unshift(newCall);
      await saveWaiterCalls(calls);
      broadcastEvent('waiter:called', newCall);

      return send(response, 201, newCall);
    }

    // PATCH /api/waiter-calls/:id/attend (Chef/Staff attends waiter call)
    const attendMatch = pathname.match(/^\/api\/waiter-calls\/([^/]+)\/attend$/);
    if (request.method === 'PATCH' && attendMatch) {
      const callId = attendMatch[1];
      const payload = await readBody(request);
      const calls = await getWaiterCalls();
      const call = calls.find(c => c.id === callId);

      if (!call) return send(response, 404, { error: 'Waiter call not found.' });

      call.status = 'Attended';
      call.attendedAt = new Date().toISOString();
      call.attendedBy = payload.attendedBy ? String(payload.attendedBy).trim() : 'Kitchen Staff';

      await saveWaiterCalls(calls);
      broadcastEvent('waiter:updated', call);

      return send(response, 200, call);
    }

    // PATCH /api/waiter-calls/:id/dismiss (Dismiss or cancel call)
    const dismissMatch = pathname.match(/^\/api\/waiter-calls\/([^/]+)\/dismiss$/);
    if (request.method === 'PATCH' && dismissMatch) {
      const callId = dismissMatch[1];
      const calls = await getWaiterCalls();
      const call = calls.find(c => c.id === callId);

      if (!call) return send(response, 404, { error: 'Waiter call not found.' });

      call.status = 'Dismissed';
      call.attendedAt = new Date().toISOString();

      await saveWaiterCalls(calls);
      broadcastEvent('waiter:updated', call);

      return send(response, 200, call);
    }

    // DELETE /api/waiter-calls/:id
    const deleteCallMatch = pathname.match(/^\/api\/waiter-calls\/([^/]+)$/);
    if (request.method === 'DELETE' && deleteCallMatch) {
      const callId = deleteCallMatch[1];
      let calls = await getWaiterCalls();
      const initialLength = calls.length;
      calls = calls.filter(c => c.id !== callId);

      if (calls.length === initialLength) {
        return send(response, 404, { error: 'Call not found.' });
      }

      await saveWaiterCalls(calls);
      broadcastEvent('waiter:deleted', { id: callId });
      return send(response, 200, { success: true, message: 'Waiter call removed' });
    }

    // GET /api/flash-sale
    if (request.method === 'GET' && pathname === '/api/flash-sale') {
      return send(response, 200, { enabled: flashSaleActive });
    }

    // POST /api/flash-sale (Toggle Flash Sale ON/OFF from KDS)
    if (request.method === 'POST' && pathname === '/api/flash-sale') {
      const payload = await readBody(request);
      flashSaleActive = payload.enabled !== undefined ? Boolean(payload.enabled) : true;
      broadcastEvent('flash-sale:changed', { enabled: flashSaleActive });
      return send(response, 200, { success: true, enabled: flashSaleActive });
    }

    // Serve Frontend Static Web App for all other routes
    if (!pathname.startsWith('/api')) {
      return serveStaticFile(response, pathname);
    }

    return send(response, 404, { error: 'Route not found.' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { error: 'Unable to process the request.' });
  }
});

server.listen(port, '0.0.0.0', () => {
  const ips = getLocalIpAddresses();
  console.log(`==================================================`);
  console.log(`🍽️  THE PODDAR'S COURTYARD Server is Running!`);
  console.log(`==================================================`);
  console.log(`➜ Local (This PC):   http://localhost:${port}`);
  if (ips.length > 0) {
    ips.forEach(ip => {
      console.log(`➜ Mobile / Network:  http://${ip}:${port}`);
    });
  }
  console.log(`\n📱 Mobile Access: Connect your phone to the same Wi-Fi`);
  console.log(`   and open the Mobile URL above in your browser.`);
  console.log(`==================================================\n`);
});
