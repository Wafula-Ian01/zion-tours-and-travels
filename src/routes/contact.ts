import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// Public route to submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone: phone || '', message }
    });
    
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Protected routes for admin
router.get('/', authenticateToken, async (req, res) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { submittedAt: 'desc' }
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const submission = await prisma.contactSubmission.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.contactSubmission.delete({ where: { id: req.params.id } });
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

export default router;
