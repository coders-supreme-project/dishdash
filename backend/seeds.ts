import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ✅ Create Users
  const users = await Promise.all(
    Array.from({ length: 30 }).map(async () =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          passwordHash: faker.internet.password(),
          role: faker.helpers.arrayElement([Role.customer, Role.restaurantOwner, Role.driver]),
          phoneNumber: faker.phone.number(),
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      })
    )
  );
  console.log(`✅ Created ${users.length} users`);

  // ✅ Create Restaurant Owners
  const restaurantOwners = await Promise.all(
    users.filter((user) => user.role === Role.restaurantOwner).map(async (user) =>
      prisma.restaurantOwner.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          userId: user.id,
        },
      })
    )
  );
  console.log(`✅ Created ${restaurantOwners.length} restaurant owners`);

  // ✅ Create Restaurants
  const restaurants = await Promise.all(
    restaurantOwners.map(async (owner) =>
      prisma.restaurant.create({
        data: {
          name: faker.company.name(),
          image: faker.image.url(),
          address: faker.location.streetAddress(),
          cuisineType: faker.helpers.arrayElement(["Italian", "Mexican", "Japanese", "Indian", "American", "French"]),
          contactNumber: faker.phone.number(),
          openingH: faker.date.past(),
          closingH: faker.date.future(),
          rating: parseFloat(faker.number.float({ min: 1, max: 5 }).toFixed(1)),
          restaurantOwnerId: owner.id,
        },
      })
    )
  );
  console.log(`✅ Created ${restaurants.length} restaurants`);

  // ✅ Create Customers
  const customers = await Promise.all(
    users.filter((user) => user.role === Role.customer).map(async (user) =>
      prisma.customer.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          deliveryAddress: faker.location.streetAddress(),
          userId: user.id,
        },
      })
    )
  );
  console.log(`✅ Created ${customers.length} customers`);

  // ✅ Create Drivers
  const drivers = await Promise.all(
    users.filter((user) => user.role === Role.driver).map(async (user) =>
      prisma.driver.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          userId: user.id,
          vehicleType: faker.vehicle.type(),
          licenseNumber: faker.string.alphanumeric(10),
          balance: parseFloat(faker.number.float({ min: 0, max: 500 }).toFixed(2)),
        },
      })
    )
  );
  console.log(`✅ Created ${drivers.length} drivers`);

  // ✅ Create Categories
  const uniqueCategoryNames = new Set<string>();

// Generate unique category names
while (uniqueCategoryNames.size < 5) {
  uniqueCategoryNames.add(faker.commerce.department());
}

// Insert unique categories into the database
const categories = await Promise.all(
  Array.from(uniqueCategoryNames).map(async (name) =>
    prisma.category.upsert({
      where: { name }, // 🔍 Check if category exists
      update: {}, // ⚡ Do nothing if it exists
      create: { name }, // ✅ Create if it does not exist
    })
  )
);


console.log(`✅ Created ${categories.length} unique categories`);
;

  // ✅ Create Menu Items
  const menuItems = await Promise.all(
    restaurants.flatMap((restaurant) =>
      Array.from({ length: 5 }).map(async () =>
        prisma.menuItem.create({
          data: {
            restaurantId: restaurant.id,
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.number.float({ min: 5, max: 50 }).toFixed(2)),
            imageUrl: faker.image.url(),
            isAvailable: faker.datatype.boolean(),
            categoryId: faker.helpers.arrayElement(categories)?.id ?? null,
          },
        })
      )
    )
  );
  console.log(`✅ Created ${menuItems.length} menu items`);

  // ✅ Create Orders
  const orders = await Promise.all(
    customers.flatMap((customer) =>
      Array.from({ length: 3 }).map(async () =>
        prisma.order.create({
          data: {
            customerId: customer.id,
            restaurantId: faker.helpers.arrayElement(restaurants)?.id ?? 1,
            totalAmount: parseFloat(faker.number.float({ min: 10, max: 200 }).toFixed(2)),
            status: faker.helpers.arrayElement(Object.values(OrderStatus)),
            deliveryAddress: faker.location.streetAddress(),
            paymentStatus: faker.helpers.arrayElement(Object.values(PaymentStatus)),
          },
        })
      )
    )
  );
  console.log(`✅ Created ${orders.length} orders`);

  // ✅ Create Order Items
  await Promise.all(
    orders.flatMap((order) =>
      Array.from({ length: 3 }).map(async () =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            menuItemId: faker.helpers.arrayElement(menuItems)?.id ?? 1,
            quantity: faker.number.int({ min: 1, max: 5 }),
            priceAtTimeOfOrder: parseFloat(faker.number.float({ min: 5, max: 50 }).toFixed(2)),
          },
        })
      )
    )
  );
  console.log(`✅ Created order items`);

  // ✅ Create GeoLocations for Restaurants
  await Promise.all(
    restaurants.map(async (restaurant) =>
      prisma.geoLocation.create({
        data: {
          latitude: Number(faker.location.latitude()),  // ✅ Corrected
          longitude: Number(faker.location.longitude()), // ✅ Corrected
          restaurantId: restaurant.id,
        },
      })
    )
  );
  
  console.log(`✅ Created geolocations`);

  // ✅ Create Media for Restaurants
  await Promise.all(
    restaurants.flatMap((restaurant) =>
      Array.from({ length: 3 }).map(async () =>
        prisma.media.create({
          data: {
            imageUrl: faker.image.url(),
            restaurantId: restaurant.id,
          },
        })
      )
    )
  );
  console.log(`✅ Created media records`);

  console.log("🌱 Seeding completed!");
}

// Run Seeder
main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
