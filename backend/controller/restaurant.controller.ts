import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Create a new restaurant
export const createRestaurant = async (req: Request, res: Response) => {
  const { name, image, address, cuisineType, contactNumber, openingH, closingH, restaurantOwnerId,restaurantRcId } = req.body;
  try {
    const formattedOpeningH = new Date(`1970-01-01T${openingH}:00.000Z`);
    const formattedClosingH = new Date(`1970-01-01T${closingH}:00.000Z`);
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        image,
        address,
        cuisineType,
        contactNumber,
        openingH:formattedOpeningH,
        closingH: formattedClosingH,
        restaurantOwnerId,
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
  const { limit } = req.query;
  try {
    const restaurants = await prisma.restaurant.findMany({
      take: limit ? Number(limit) : undefined,
      include: {
        menuItems: {
          include: {
            category: true,
          }
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
  const { name, image, address, cuisineType, contactNumber, openingH, closingH } = req.body;
  try {
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
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

// Delete a restaurant
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
    const filteredRestaurants = minPrice || maxPrice
      ? restaurants.filter(restaurant => 
          restaurant.menuItems.some(item => 
            (!minPrice || Number(item.price) >= Number(minPrice)) &&
            (!maxPrice || Number(item.price) <= Number(maxPrice))
          )
        )
      : restaurants;

    res.status(200).json(filteredRestaurants);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
};

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
export const getRestaurantsLocation = async (req: Request, res: Response) => {
  try {
    // Fetch restaurants with their geolocation data
    const restaurants = await prisma.restaurant.findMany({
      include: {
        geoLocation: true, // Include the associated geolocation data
      },
    });

    // Transform the data to include only necessary fields
    const formattedRestaurants = restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.geoLocation?.[0]?.latitude,
      longitude: restaurant.geoLocation?.[0]?.longitude,
    }));

    res.status(200).json(formattedRestaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};