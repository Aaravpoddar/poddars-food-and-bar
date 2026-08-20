import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const ordersFile = join(rootDirectory, 'data', 'orders.json');
const port = 3002;

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
  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
  
  const pendingCount = orders.filter(o => o.status === 'New').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;
  const completedToday = todaysOrders.filter(o => o.status === 'Completed').length;
  const revenueToday = todaysOrders
    .filter(o => o.status === 'Completed' || o.status === 'Ready' || o.status === 'Preparing')
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

      // Default known staff credentials or dynamically accept valid credentials
      const knownChefs = {
        'CHEF-001': { name: 'Chef Aarav', role: 'Head Chef' },
        'CHEF-002': { name: 'Chef Vikram', role: 'Sous Chef' },
        'CHEF-003': { name: 'Chef Sanjeev', role: 'Line Chef' },
        '1234': { name: 'Executive Chef', role: 'Master Chef' }
      };

      const matched = knownChefs[chefId];
      const chefProfile = {
        id: chefId,
        name: matched ? matched.name : name,
        role: matched ? matched.role : 'Kitchen Staff',
        loggedInAt: new Date().toISOString()
      };

      return send(response, 200, {
        success: true,
        token: `kds_token_${Date.now()}_${chefId}`,
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
        mode: payload.mode === 'Self pickup' ? 'Self pickup' : 'Dine in',
        table: payload.mode === 'Dine in' ? (payload.table || 'Table 12') : null,
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

    return send(response, 404, { error: 'Route not found.' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { error: 'Unable to process the request.' });
  }
});

server.listen(port, () => console.log(`Chef & Restaurant API is running at http://localhost:${port}`));
