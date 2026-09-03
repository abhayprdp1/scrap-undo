import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed rate cards for major Indian cities
  const rateCards = [
    // Electronics
    { category: 'Electronics', subcategory: 'CRT TV', cityZone: 'Mumbai', unit: 'piece', minRate: 200, maxRate: 500 },
    { category: 'Electronics', subcategory: 'CRT TV', cityZone: 'Delhi', unit: 'piece', minRate: 180, maxRate: 450 },
    { category: 'Electronics', subcategory: 'CRT TV', cityZone: 'Bangalore', unit: 'piece', minRate: 220, maxRate: 520 },
    { category: 'Electronics', subcategory: 'LCD/LED TV', cityZone: 'Mumbai', unit: 'piece', minRate: 300, maxRate: 800 },
    { category: 'Electronics', subcategory: 'LCD/LED TV', cityZone: 'Delhi', unit: 'piece', minRate: 280, maxRate: 750 },
    { category: 'Electronics', subcategory: 'LCD/LED TV', cityZone: 'Bangalore', unit: 'piece', minRate: 320, maxRate: 850 },
    { category: 'Electronics', subcategory: 'Laptop/PC', cityZone: 'Mumbai', unit: 'piece', minRate: 800, maxRate: 3000 },
    { category: 'Electronics', subcategory: 'Laptop/PC', cityZone: 'Delhi', unit: 'piece', minRate: 750, maxRate: 2800 },
    { category: 'Electronics', subcategory: 'Laptop/PC', cityZone: 'Bangalore', unit: 'piece', minRate: 900, maxRate: 3200 },
    { category: 'Electronics', subcategory: 'Mobile Phone', cityZone: 'Mumbai', unit: 'piece', minRate: 100, maxRate: 500 },
    { category: 'Electronics', subcategory: 'Mobile Phone', cityZone: 'Delhi', unit: 'piece', minRate: 100, maxRate: 480 },
    { category: 'Electronics', subcategory: 'Refrigerator', cityZone: 'Mumbai', unit: 'piece', minRate: 500, maxRate: 1500 },
    { category: 'Electronics', subcategory: 'Washing Machine', cityZone: 'Mumbai', unit: 'piece', minRate: 400, maxRate: 1200 },
    { category: 'Electronics', subcategory: 'AC', cityZone: 'Mumbai', unit: 'piece', minRate: 600, maxRate: 2000 },
    { category: 'Electronics', subcategory: 'Mixed Cables', cityZone: 'Mumbai', unit: 'kg', minRate: 30, maxRate: 80 },

    // Metal
    { category: 'Metal', subcategory: 'Iron/Steel', cityZone: 'Mumbai', unit: 'kg', minRate: 25, maxRate: 35 },
    { category: 'Metal', subcategory: 'Iron/Steel', cityZone: 'Delhi', unit: 'kg', minRate: 22, maxRate: 32 },
    { category: 'Metal', subcategory: 'Iron/Steel', cityZone: 'Bangalore', unit: 'kg', minRate: 24, maxRate: 34 },
    { category: 'Metal', subcategory: 'Aluminum', cityZone: 'Mumbai', unit: 'kg', minRate: 80, maxRate: 110 },
    { category: 'Metal', subcategory: 'Aluminum', cityZone: 'Delhi', unit: 'kg', minRate: 75, maxRate: 105 },
    { category: 'Metal', subcategory: 'Copper', cityZone: 'Mumbai', unit: 'kg', minRate: 450, maxRate: 550 },
    { category: 'Metal', subcategory: 'Copper', cityZone: 'Delhi', unit: 'kg', minRate: 440, maxRate: 540 },
    { category: 'Metal', subcategory: 'Brass', cityZone: 'Mumbai', unit: 'kg', minRate: 280, maxRate: 360 },

    // Paper
    { category: 'Paper', subcategory: 'Newspaper', cityZone: 'Mumbai', unit: 'kg', minRate: 10, maxRate: 16 },
    { category: 'Paper', subcategory: 'Newspaper', cityZone: 'Delhi', unit: 'kg', minRate: 9, maxRate: 15 },
    { category: 'Paper', subcategory: 'Cardboard', cityZone: 'Mumbai', unit: 'kg', minRate: 8, maxRate: 12 },
    { category: 'Paper', subcategory: 'Office Paper', cityZone: 'Mumbai', unit: 'kg', minRate: 10, maxRate: 14 },
    { category: 'Paper', subcategory: 'Books', cityZone: 'Mumbai', unit: 'kg', minRate: 8, maxRate: 12 },

    // Plastic
    { category: 'Plastic', subcategory: 'PET Bottles', cityZone: 'Mumbai', unit: 'kg', minRate: 8, maxRate: 15 },
    { category: 'Plastic', subcategory: 'HDPE', cityZone: 'Mumbai', unit: 'kg', minRate: 6, maxRate: 10 },
    { category: 'Plastic', subcategory: 'Mixed Plastic', cityZone: 'Mumbai', unit: 'kg', minRate: 4, maxRate: 8 },

    // Others
    { category: 'Others', subcategory: 'Glass', cityZone: 'Mumbai', unit: 'kg', minRate: 2, maxRate: 5 },
    { category: 'Others', subcategory: 'Tyres/Rubber', cityZone: 'Mumbai', unit: 'piece', minRate: 20, maxRate: 60 },
    { category: 'Others', subcategory: 'Wooden Furniture', cityZone: 'Mumbai', unit: 'piece', minRate: 50, maxRate: 300 },
  ];

  for (const card of rateCards) {
    await prisma.scrapRateCard.upsert({
      where: {
        category_subcategory_cityZone: {
          category: card.category,
          subcategory: card.subcategory,
          cityZone: card.cityZone,
        },
      },
      update: { minRate: card.minRate, maxRate: card.maxRate },
      create: card,
    });
  }

  console.log(`✅ Seeded ${rateCards.length} rate cards`);

  // Seed a sample admin user
  const admin = await prisma.user.upsert({
    where: { phone: '+919999999999' },
    update: {},
    create: {
      name: 'Admin User',
      phone: '+919999999999',
      role: 'ADMIN',
      address: 'Mumbai, Maharashtra',
      geoLat: 19.076,
      geoLng: 72.8777,
    },
  });

  // Seed sample dealers
  const dealer1 = await prisma.user.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      name: 'Ramesh Kumar',
      phone: '+919876543210',
      role: 'DEALER',
      address: 'Dharavi, Mumbai',
      geoLat: 19.043,
      geoLng: 72.855,
      dealer: {
        create: {
          shopName: 'Ramesh Scrap Works',
          categories: ['Electronics', 'Metal', 'Paper'],
          serviceRadiusKm: 10,
          geoLat: 19.043,
          geoLng: 72.855,
          kycStatus: 'VERIFIED',
          ratingAvg: 4.5,
          totalRatings: 23,
          isActive: true,
        },
      },
    },
  });

  const dealer2 = await prisma.user.upsert({
    where: { phone: '+919876543211' },
    update: {},
    create: {
      name: 'Suresh Electronics',
      phone: '+919876543211',
      role: 'DEALER',
      address: 'Kurla, Mumbai',
      geoLat: 19.071,
      geoLng: 72.88,
      dealer: {
        create: {
          shopName: 'Suresh E-Waste Recyclers',
          categories: ['Electronics'],
          serviceRadiusKm: 15,
          geoLat: 19.071,
          geoLng: 72.88,
          kycStatus: 'VERIFIED',
          ratingAvg: 4.8,
          totalRatings: 47,
          isActive: true,
        },
      },
    },
  });

  console.log('✅ Seeded sample admin and dealers');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
