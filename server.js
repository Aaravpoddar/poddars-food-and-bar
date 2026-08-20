import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const ordersFile = join(rootDirectory, 'data', 'orders.json');
const port = 3002;

async function getOrders() {
  try {
    return JSON.parse(await readFile(ordersFile, 'utf8'));
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
      try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON body')); }
    });
  });
}

const server = createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') return response.end();

  try {
    if (request.method === 'GET' && request.url === '/api/orders') {
      return send(response, 200, await getOrders());
    }

    if (request.method === 'POST' && request.url === '/api/orders') {
      const payload = await readBody(request);
      if (!Array.isArray(payload.items) || payload.items.length === 0) {
        return send(response, 400, { error: 'An order needs at least one item.' });
      }
      const orders = await getOrders();
      const order = {
        id: `TP-${Date.now().toString().slice(-6)}`,
        status: 'New',
        createdAt: new Date().toISOString(),
        mode: payload.mode === 'Self pickup' ? 'Self pickup' : 'Dine in',
        table: payload.mode === 'Dine in' ? 'Table 12' : null,
        items: payload.items,
        instructions: String(payload.instructions || '').slice(0, 500),
        subtotal: Number(payload.subtotal || 0),
        gst: Number(payload.gst || 0),
        total: Number(payload.total || 0)
      };
      orders.unshift(order);
      await saveOrders(orders);
      return send(response, 201, order);
    }

    const statusMatch = request.url?.match(/^\/api\/orders\/([^/]+)\/status$/);
    if (request.method === 'PATCH' && statusMatch) {
      const payload = await readBody(request);
      const allowedStatuses = ['New', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
      if (!allowedStatuses.includes(payload.status)) return send(response, 400, { error: 'Invalid status.' });
      const orders = await getOrders();
      const order = orders.find(item => item.id === statusMatch[1]);
      if (!order) return send(response, 404, { error: 'Order not found.' });
      order.status = payload.status;
      await saveOrders(orders);
      return send(response, 200, order);
    }

    return send(response, 404, { error: 'Route not found.' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { error: 'Unable to process the request.' });
  }
});

server.listen(port, () => console.log(`The Poddars hotel API is running at http://localhost:${port}`));
