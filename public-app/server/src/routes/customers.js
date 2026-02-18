import { Router } from 'express';
import { Customer, LoyaltyTransaction } from '../db/index.js';
import { validateSession } from '../middleware/session.js';
import { getCustomers as fetchShopifyCustomers } from '../services/shopifyApi.js';

const router = Router();

router.use(validateSession);

/**
 * GET /api/customers
 * List customers for the shop (from our DB; optionally sync from Shopify).
 */
router.get('/', async (req, res) => {
  try {
    const list = await Customer.findAll({
      where: { shopId: req.shop.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ customers: list });
  } catch (err) {
    console.error('List customers error:', err);
    res.status(500).json({ error: 'Failed to list customers' });
  }
});

/**
 * POST /api/customers/sync
 * Fetch customers from Shopify and upsert into our DB (create Customer rows with 0 points).
 */
router.post('/sync', async (req, res) => {
  try {
    const shopifyCustomers = await fetchShopifyCustomers(req.shop);
    for (const c of shopifyCustomers) {
      await Customer.findOrCreate({
        where: { shopId: req.shop.id, shopifyCustomerId: c.id },
        defaults: {
          shopId: req.shop.id,
          shopifyCustomerId: c.id,
          email: c.email || null,
          note: c.note || null,
          loyaltyPoints: 0,
        },
      });
    }
    const list = await Customer.findAll({
      where: { shopId: req.shop.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ customers: list });
  } catch (err) {
    console.error('Sync customers error:', err);
    res.status(500).json({ error: 'Failed to sync customers' });
  }
});

/**
 * GET /api/customers/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, shopId: req.shop.id },
      include: [{ model: LoyaltyTransaction }],
      order: [[LoyaltyTransaction, 'createdAt', 'DESC']],
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error('Get customer error:', err);
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

/**
 * PATCH /api/customers/:id
 * Update note and/or loyalty points.
 */
router.patch('/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, shopId: req.shop.id },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const { note, loyaltyPoints } = req.body;
    if (note !== undefined) customer.note = note;
    if (typeof loyaltyPoints === 'number') customer.loyaltyPoints = loyaltyPoints;
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error('Update customer error:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

/**
 * POST /api/customers/:id/points
 * Add a loyalty transaction (adjust points and optional note).
 * Body: { points: number, note?: string }
 */
router.post('/:id/points', async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, shopId: req.shop.id },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const { points, note } = req.body;
    if (typeof points !== 'number') {
      return res.status(400).json({ error: 'points must be a number' });
    }

    const txn = await LoyaltyTransaction.create({
      shopId: req.shop.id,
      customerId: customer.id,
      points,
      note: note || null,
    });
    customer.loyaltyPoints = (customer.loyaltyPoints || 0) + points;
    await customer.save();

    res.status(201).json({ transaction: txn, customer });
  } catch (err) {
    console.error('Add points error:', err);
    res.status(500).json({ error: 'Failed to add points' });
  }
});

export default router;
