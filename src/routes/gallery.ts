import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { url, title, description } = req.body;
    const image = await prisma.galleryImage.create({
      data: { url, title, description }
    });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add image' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const image = await prisma.galleryImage.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update image' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.galleryImage.delete({ where: { id: req.params.id } });
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
