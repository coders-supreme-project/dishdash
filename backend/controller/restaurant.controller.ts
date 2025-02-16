import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import crypto from "crypto";

cloudinary.config({
  cloud_name: "drliudydx",
  api_key: "516363278445275",
  api_secret: "dj-hWW7JRK0AYtEqiIXUUcWKuK8",
});


const prisma = new PrismaClient();
const uploadImage = async (filePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url; // Returns Cloudinary image URL
  } catch (error) {
    throw new Error("Image upload failed");
  }
};
export const signCloudinary = (req: Request, res: Response) => {
  const { timestamp } = req.body;
  const secret = "dj-hWW7JRK0AYtEqiIXUUcWKuK8";

  if (!secret) {
    return res.status(500).json({ error: "Cloudinary secret is missing" });
  }

  const signature = crypto
    .createHash("sha1")
    .update(`timestamp=${timestamp} ${secret}`)
    .digest("hex");

  res.json({
    signature,
    timestamp,
    apiKey: "516363278445275",
  });
};


// Create a new restaurant

export const createRestaurant = async (req: Request, res: Response) => {
  const { name, image, address, cuisineType, contactNumber, openingH, closingH, restaurantOwnerId,restaurantRcId } = req.body;

  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        image,
        address,
        cuisineType,
        contactNumber,
        openingH: new Date(openingH),
        closingH: new Date(closingH),
        restaurantOwner: {
          connect: { id: restaurantOwnerId }
        },
        restaurantRcId
      },
    });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};



// Get all restaurants
export const getAllRestaurants = async (req: Request, res: Response) => {
  const { ownerId } = req.query; // Add ownerId filter

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: ownerId ? { restaurantOwnerId: Number(ownerId) } : undefined,
      include: {
        menuItems: {
          include: { category: true }
        },
        geoLocation: true,
        media: true,
      },
    });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};
// Get a restaurant by ID
export const getRestaurantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: Number(id) },
      include: {
        menuItems: true,
        geoLocation: true,
        media: true,
        
      },
    });
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

// Update a restaurant
export const updateRestaurant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, cuisineType, contactNumber, openingH, closingH } = req.body;
  let image = req.body.image;

  try {
    //@ts-ignore
    if (req.file) {
          //@ts-ignore

      const uploadedImage = await cloudinary.uploader.upload(req.file.path);
      image = uploadedImage.secure_url;
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: Number(id) },
      data: {
        name,
        image,
        address,
        cuisineType,
        contactNumber,
        openingH: new Date(openingH),
        closingH: new Date(closingH),
      },
    });

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Failed to update restaurant" });
  }
};
export const deleteRestaurant = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.restaurant.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

export const searchRestaurants = async (req: Request, res: Response) => {
  const { name, minPrice, maxPrice } = req.query;
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          name ? {
            name: {
              contains: name as string,
              // Case-insensitive search
            }
          } : {},
          minPrice || maxPrice ? {
            menuItems: {
              some: {
                price: {
                  ...(minPrice ? { gte: Number(minPrice) } : {}),
                  ...(maxPrice ? { lte: Number(maxPrice) } : {}),
                },
              },
            },
          } : {},
        ],
      },
      include: {
        menuItems: {
          include: {
            category: true,
          },
        },
        geoLocation: true,
        media: true,
      },
    });
  
    // If searching by price range, filter restaurants that have at least one menu item in range
    const filteredRestaurants = (minPrice || maxPrice)
    ? restaurants.filter(restaurant =>
        restaurant.menuItems.some(item =>
          (minPrice ? Number(item.price) >= Number(minPrice) : true) &&
          (maxPrice ? Number(item.price) <= Number(maxPrice) : true)
        )
      )
    : restaurants;
  
  res.status(200).json(filteredRestaurants);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
}

export const getRestaurantMenuByCategory = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: Number(restaurantId),
      },
      include: {
        category: true,
      },
    });

    // Group menu items by category
    const menuByCategory = menuItems.reduce((acc: any, item) => {
      const categoryId = item.categoryId ?? 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryName: item.category?.name || 'Uncategorized',
          items: []
        };
      }
      acc[categoryId].items.push(item);
      return acc;
    }, {});

    res.status(200).json(menuByCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant menu' });
  }
};

// Add this function to get the restaurant ID by owner ID
export const getRestaurantIdByOwnerId = async (req: Request, res: Response) => {
  const { ownerId } = req.params;
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { restaurantOwnerId: Number(ownerId) },
      select: { id: true },
    });

    if (restaurant) {
      res.status(200).json({ restaurantId: restaurant.id });
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant ID' });
  }
};
