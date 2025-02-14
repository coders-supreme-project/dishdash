import { Request, Response } from 'express';
import { PrismaClient, Media } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for the request body
interface CreateMediaInput {
  imageUrl?: string;
  reviewText?: string;
  rating?: number;
  userId?: number;
  restaurantId?: number;
  driverId?: number;
  customerId?: number;
  orderItemId?: number;
}

// Define types for the response
type MediaResponse = Media | { error: string; details?: string };
export const createMedia = async (req: Request, res: Response) => {
    const { imageUrl, reviewText, rating, userId, restaurantId, driverId, customerId, orderItemId }: CreateMediaInput = req.body;
  
    try {
      const newMedia = await prisma.media.create({
        data: {
          imageUrl,
          reviewText,
          rating,
          userId,
          restaurantId,
          driverId,
          customerId,
          orderItemId,
        },
      });
  
      res.status(201).json(newMedia);
    } catch (error) {
      console.error('Error creating media:', error);
      res.status(400).json({ error: 'Failed to create media', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  };
  export const getMedia = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      if (id) {
        const media = await prisma.media.findUnique({
          where: { id: parseInt(id) },
        });
  
        if (media) {
          res.status(200).json(media);
        } else {
          res.status(404).json({ error: 'Media not found' });
        }
      } else {
        const allMedia = await prisma.media.findMany();
        res.status(200).json(allMedia);
      }
    } catch (error) {
      console.error('Error retrieving media:', error);
      res.status(400).json({ error: 'Failed to retrieve media', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  };