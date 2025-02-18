export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  address: string;
  cuisineType: string;
  closingH: string;
  contactNumber: string;
  geoLocation: any[]; // You may want to type this more specifically
  openingH: string;
  rating: number;
  restaurantOwner: {
    id: number;
    firstName: string;
    lastName: string;
    userId: number;
    user: {
      id: number;
      email: string;
      // Add any other fields that are part of the user object here
    };
  };
  restaurantOwnerId: number;
  restaurantRcId: string;
  media: any[]; // You might want to define this more specifically
  menuItems: any[]; // Define this based on structure
}

export interface User {
  id: string;
  email: string;
}
