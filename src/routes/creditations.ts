import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const creditations = await prisma.creditation.findMany();
    res.json(creditations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch creditations' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, icon } = req.body;
    const creditation = await prisma.creditation.create({
      data: { name, icon }
    });
    res.status(201).json(creditation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create creditation' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const creditation = await prisma.creditation.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(creditation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update creditation' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.creditation.delete({ where: { id: req.params.id } });
    res.json({ message: 'Creditation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete creditation' });
  }
});

export default router;