import { createServer } from 'node:http';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const distDirectory = join(rootDirectory, 'dist');
const ordersFile = join(rootDirectory, 'data', 'orders.json');
const waiterCallsFile = join(rootDirectory, 'data', 'waiter_calls.json');
const port = 3002;

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
  try {
    const fileStat = await stat(targetPath);
    if (fileStat.isDirectory()) {
      targetPath = join(targetPath, 'index.html');
    }
    const content = await readFile(targetPath);
    const ext = extname(targetPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    response.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Bypass-Tunnel-Reminder',
      'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000'
    });
    return response.end(content);
  } catch {
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
        <p>Please build the frontend using <code>npm run build</code> or run in development mode with <code>npm run dev</code>.</p>
      `);
    }
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
    // SSE Stream for Realtime Live Sync
    if (request.method === 'GET' && pathname === '/api/events') {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      response.write('retry: 3000\n\n');
      sseClients.add(response);

      request.on('close', () => {
        sseClients.delete(response);
      });
      return;
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

      // Strictly Authorized 4 Kitchen Chefs Only
      const authorizedChefs = [
        { name: 'CHEF AARAV', id: 'CHEF 1910', role: 'Executive Chef', idVariations: ['CHEF 1910', 'CHEF1910', '1910', 'CHEF-1910'] },
        { name: 'CHEF VANISHA', id: 'CHEF 0101', role: 'Head Chef', idVariations: ['CHEF 0101', 'CHEF0101', '0101', 'CHEF-0101'] },
        { name: 'CHEF EKTA', id: 'CHEF 0804', role: 'Master Pastry Chef', idVariations: ['CHEF 0804', 'CHEF0804', '0804', 'CHEF-0804'] },
        { name: 'CHEF ANKIT', id: 'CHEF 1602', role: 'Sous Chef', idVariations: ['CHEF 1602', 'CHEF1602', '1602', 'CHEF-1602'] }
      ];

      const normName = name.toUpperCase().replace(/^CHEF\s*/, '');
      const normId = chefId.toUpperCase().replace(/[\s-]/g, '');

      const matched = authorizedChefs.find(c => {
        const chefCoreName = c.name.toUpperCase().replace(/^CHEF\s*/, '');
        const nameMatch = normName === chefCoreName || normName === c.name.toUpperCase();
        const idMatch = c.idVariations.some(v => v.replace(/[\s-]/g, '').toUpperCase() === normId);
        return nameMatch && idMatch;
      });

      if (!matched) {
        return send(response, 401, {
          error: 'Sorry, you are not a chef.',
          unauthorized: true
        });
      }

      const chefProfile = {
        id: matched.id,
        name: matched.name,
        role: matched.role,
        loggedInAt: new Date().toISOString()
      };

      return send(response, 200, {
        success: true,
        token: `kds_token_${Date.now()}_${matched.id.replace(/\s+/g, '')}`,
        chef: chefProfile
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

      return send(response, 201, order);
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

      await saveOrders(orders);
      broadcastEvent('order:updated', order);

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
      if (payload.status === 'Cancelled') order.cancelledAt = now;

      if (payload.prepTime) order.estimatedPrepTime = Number(payload.prepTime);
      if (payload.chefNote) order.chefNote = String(payload.chefNote).trim();

      await saveOrders(orders);
      broadcastEvent('order:updated', order);

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

server.listen(port, () => {
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
