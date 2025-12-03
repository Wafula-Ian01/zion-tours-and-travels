import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await prisma.fAQ.create({
      data: { question, answer }
    });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const faq = await prisma.fAQ.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.fAQ.delete({ where: { id: req.params.id } });
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;
