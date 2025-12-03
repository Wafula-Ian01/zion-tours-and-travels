import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// GET all packages (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const packages = await prisma.travelPackage.findMany({
      where: category ? { category: category as string } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    res.json(packages);
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// GET single package (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const pkg = await prisma.travelPackage.findUnique({
      where: { id }
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(pkg);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

// CREATE package (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, duration, image, category, details } = req.body;

    if (!title || !description || !price || !duration || !category || !details) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const pkg = await prisma.travelPackage.create({
      data: {
        title,
        description,
        price,
        duration,
        image: image || '',
        category,
        details
      }
    });

    res.status(201).json(pkg);
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

// UPDATE package (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, duration, image, category, details } = req.body;

    const pkg = await prisma.travelPackage.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(duration && { duration }),
        ...(image && { image }),
        ...(category && { category }),
        ...(details && { details })
      }
    });

    res.json(pkg);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// DELETE package (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.travelPackage.delete({
      where: { id }
    });

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

export default router;
