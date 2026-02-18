import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { config } from './config/index.js';
import { sequelize } from './db/index.js';
import authRoutes from './routes/auth.js';
import webhooksRoutes from './routes/webhooks.js';
import billingRoutes from './routes/billing.js';
import customersRoutes from './routes/customers.js';
import shopRoutes from './routes/shop.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: true, credentials: true }));

// Webhooks MUST use raw body for HMAC verification – mount before express.json()
app.use('/webhooks', express.raw({ type: '*/*', limit: '1mb' }), (req, res, next) => {
  req.rawBody = req.body; // Buffer (raw body)
  next();
}, webhooksRoutes);

// JSON body parser for all other routes
app.use(express.json());

// Auth routes (no session required)
app.use('/auth', authRoutes);

// API routes (session-validated)
app.use('/api/billing', billingRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/shop', shopRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple test API to confirm the API works (no auth)
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'API works', timestamp: new Date().toISOString() });
});

// Serve embedded app (React build) so one URL works for Shopify Admin iframe
const clientDist = join(__dirname, '..', '..', 'client', 'dist');
const indexPath = join(clientDist, 'index.html');

function serveAppHtml(req, res) {
  try {
    let html = readFileSync(indexPath, 'utf8');
    const apiKey = config.shopify?.apiKey || '';
    html = html.replace(/%SHOPIFY_API_KEY%/g, apiKey);
    res.set('Content-Type', 'text/html').send(html);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
}

if (existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false })); // don't serve raw index.html for /
  app.get('*', serveAppHtml);
} else {
  app.use((req, res) => res.status(404).json({ error: 'Not found', hint: 'Run npm run build (client) so client/dist exists' }));
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: true });
    console.log('Database synced');
  } catch (e) {
    console.error('Database connection failed:', e);
    process.exit(1);
  }
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

start();
