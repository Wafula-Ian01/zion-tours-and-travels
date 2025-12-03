import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// GET settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.cMSSettings.findFirst();
    
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// UPDATE settings (protected)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      whatsappNumber,
      aboutContent,
      facebook,
      instagram,
      twitter,
      linkedin
    } = req.body;

    // Get the first (and should be only) settings record
    const existingSettings = await prisma.cMSSettings.findFirst();

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.cMSSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...(companyName && { companyName }),
          ...(companyEmail && { companyEmail }),
          ...(companyPhone && { companyPhone }),
          ...(whatsappNumber && { whatsappNumber }),
          ...(aboutContent && { aboutContent }),
          ...(facebook !== undefined && { facebook }),
          ...(instagram !== undefined && { instagram }),
          ...(twitter !== undefined && { twitter }),
          ...(linkedin !== undefined && { linkedin })
        }
      });
    } else {
      // Create new settings if none exist
      settings = await prisma.cMSSettings.create({
        data: {
          companyName: companyName || 'Zion Train Tours & Travel',
          companyEmail: companyEmail || 'info@ziontraintours.com',
          companyPhone: companyPhone || '+256 XXX XXX XXX',
          whatsappNumber: whatsappNumber || '+256 XXX XXX XXX',
          aboutContent: aboutContent || '',
          facebook,
          instagram,
          twitter,
          linkedin
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
