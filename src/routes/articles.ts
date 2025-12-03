import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const articles = await prisma.blogArticle.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: { id: req.params.id }
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, image, author } = req.body;
    const article = await prisma.blogArticle.create({
      data: { title, excerpt, content, image: image || '', author, date: new Date() }
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const article = await prisma.blogArticle.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.blogArticle.delete({ where: { id: req.params.id } });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;