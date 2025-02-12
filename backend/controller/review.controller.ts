import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { promises } from 'dns';

const prisma = new PrismaClient();

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  const { imageUrl, reviewText, rating, userId, restaurantId, driverId, customerId, orderItemId } = req.body;

  try {
    const review = await prisma.media.create({
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

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.media.findMany();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get a review by ID
export const getReviewById = async (req: Request, res: Response)=> {
  const { id } = req.params;

  try {
    const review = await prisma.media.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { imageUrl, reviewText, rating } = req.body;

  try {
    const updatedReview = await prisma.media.update({
      where: { id: parseInt(id) },
      data: {
        imageUrl,
        reviewText,
        rating,
      },
    });

    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.media.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

// Get reviews by user ID
export const getReviewsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const reviews = await prisma.media.findMany({
      where: { userId: parseInt(userId) },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by user ID:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get reviews by restaurant ID
export const getReviewsByRestaurantId = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const reviews = await prisma.media.findMany({
      where: { restaurantId: parseInt(restaurantId) },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by restaurant ID:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get reviews by driver ID
export const getReviewsByDriverId = async (req: Request, res: Response) => {
  const { driverId } = req.params;

  try {
    const reviews = await prisma.media.findMany({
      where: { driverId: parseInt(driverId) },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by driver ID:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get reviews by customer ID
export const getReviewsByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const reviews = await prisma.media.findMany({
      where: { customerId: parseInt(customerId) },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by customer ID:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get reviews by order item ID
export const getReviewsByOrderItemId = async (req: Request, res: Response) => {
  const { orderItemId } = req.params;

  try {
    const reviews = await prisma.media.findMany({
      where: { orderItemId: parseInt(orderItemId) },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by order item ID:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};