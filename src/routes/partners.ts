import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, logo, type } = req.body;
    const partner = await prisma.partner.create({
      data: { name, logo, type }
    });
    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const partner = await prisma.partner.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.partner.delete({ where: { id: req.params.id } });
    res.json({ message: 'Partner deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

export default router;