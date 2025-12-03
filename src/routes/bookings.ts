import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// Public route to create booking inquiry
router.post('/', async (req, res) => {
  try {
    const {
      packageId,
      packageTitle,
      customerName,
      email,
      phone,
      preferredDate,
      numberOfPeople,
      specialRequests
    } = req.body;

    if (!packageId || !customerName || !email || !phone || !preferredDate || !numberOfPeople) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const booking = await prisma.bookingInquiry.create({
      data: {
        packageId,
        packageTitle,
        customerName,
        email,
        phone,
        preferredDate,
        numberOfPeople,
        specialRequests: specialRequests || null
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking inquiry' });
  }
});

// Protected routes for admin
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    const bookings = await prisma.bookingInquiry.findMany({
      where: status ? { status: status as string } : undefined,
      include: {
        package: {
          select: {
            title: true,
            price: true,
            duration: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await prisma.bookingInquiry.findUnique({
      where: { id: req.params.id },
      include: {
        package: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await prisma.bookingInquiry.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.bookingInquiry.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
