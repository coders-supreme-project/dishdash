import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Coordinates for a central location in Tunis, Tunisia
  const tunisCoordinates = {
    latitude: 36.8065,  // Latitude for Tunis
    longitude: 10.1815, // Longitude for Tunis
  };

  // Create 5 fake users
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        passwordHash: faker.internet.password(),
        role: faker.helpers.arrayElement(['customer', 'restaurantOwner', 'driver']),
        phoneNumber: faker.phone.number(),
        balance: parseFloat(faker.commerce.price()),
      },
    });

    // Create a customer, restaurantOwner, or driver based on the role
    if (user.role === 'customer') {
      const customer = await prisma.customer.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          deliveryAddress: faker.location.streetAddress(),
          userId: user.id,
        },
      });

      // Create a geolocation for the customer in Tunis
      await prisma.geoLocation.create({
        data: {
          latitude: tunisCoordinates.latitude + faker.number.float({ min: -0.1, max: 0.1 }), // Randomize within a small range
          longitude: tunisCoordinates.longitude + faker.number.float({ min: -0.1, max: 0.1 }),
          customerId: customer.id,
        },
      });
    } else if (user.role === 'restaurantOwner') {
      const restaurantOwner = await prisma.restaurantOwner.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          userId: user.id,
        },
      });

      // Create a restaurant for this owner
      const restaurant = await prisma.restaurant.create({
        data: {
          name: faker.company.name(),
          address: faker.location.streetAddress(),
          contactNumber: faker.phone.number(),
          openingH: faker.date.recent(),
          closingH: faker.date.future(),
          restaurantOwnerId: restaurantOwner.id,
        },
      });

      // Create a geolocation for the restaurant in Tunis
      await prisma.geoLocation.create({
        data: {
          latitude: tunisCoordinates.latitude + faker.number.float({ min: -0.1, max: 0.1 }), // Randomize within a small range
          longitude: tunisCoordinates.longitude + faker.number.float({ min: -0.1, max: 0.1 }),
          restaurantId: restaurant.id,
        },
      });
    } else if (user.role === 'driver') {
      const driver = await prisma.driver.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          vehicleType: faker.vehicle.type(),
          licenseNumber: faker.vehicle.vin(),
          balance: parseFloat(faker.commerce.price()),
          userId: user.id,
        },
      });

      // Create a geolocation for the driver in Tunis
      await prisma.geoLocation.create({
        data: {
          latitude: tunisCoordinates.latitude + faker.number.float({ min: -0.1, max: 0.1 }), // Randomize within a small range
          longitude: tunisCoordinates.longitude + faker.number.float({ min: -0.1, max: 0.1 }),
          driverId: driver.id,
        },
      });
    }
  }

  // Create a fake order with random items for customers
  const customer = await prisma.customer.findFirst();
  const restaurant = await prisma.restaurant.findFirst();

  if (customer && restaurant) {
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        restaurantId: restaurant.id,
        totalAmount: parseFloat(faker.commerce.price()),
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'prepared', 'out_for_delivery', 'delivered']),
        deliveryAddress: faker.location.streetAddress(),
        paymentStatus: faker.helpers.arrayElement(['pending', 'completed', 'failed']),
      },
    });

    // Create fake order items
    for (let i = 0; i < 3; i++) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: faker.number.int(),
          quantity: faker.number.int({ min: 1, max: 5 }),
          priceAtTimeOfOrder: parseFloat(faker.commerce.price()),
        },
      });
    }
  }

  console.log('Fake data generated successfully!');
}
// Create a restaurant for this owner
const cuisineTypes = ["Italian", "Japanese", "Indian", "Mexican", "Chinese"];
const randomCuisine = faker.helpers.arrayElement(cuisineTypes);

// Create a restaurant for this owner
const restaurant = await prisma.restaurant.create({
  data: {
    name: "Leffler and Sons",
    address: "44682 Ila Light",
    contactNumber: "(602) 531-2718",
    openingH: new Date("2025-02-11T10:57:03.898Z"),
    closingH: new Date("2026-01-19T07:24:32.041Z"),
    restaurantOwnerId: 1,
    cuisineType: randomCuisine // Randomly select a cuisine type
  }
});

  
main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
