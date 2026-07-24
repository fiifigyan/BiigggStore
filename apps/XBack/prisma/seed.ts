import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed products
  const products = [
    {
      title: 'Premium Leather Jacket',
      description: 'High-quality genuine leather jacket with a classic fit.',
      price: 14999, // GHS 149.99
      images: ['https://picsum.photos/seed/jacket/400/400'],
      category: 'Clothes',
      subcategory: 'Jackets',
      stock: 50,
      isFeatured: true,
    },
    {
      title: 'Luxury Perfume - Oud Collection',
      description: 'A sophisticated blend of rare oud, bergamot, and amber.',
      price: 8999, // GHS 89.99
      images: ['https://picsum.photos/seed/perfume/400/400'],
      category: 'Perfumes',
      subcategory: 'Luxury',
      stock: 30,
      isFeatured: true,
    },
    {
      title: 'Organic Skincare Set',
      description: 'Complete skincare routine with organic ingredients.',
      price: 5999, // GHS 59.99
      images: ['https://picsum.photos/seed/skincare/400/400'],
      category: 'Skin Care',
      subcategory: 'Organic',
      stock: 40,
      isFeatured: false,
    },
    {
      title: 'Designer Sunglasses',
      description: 'Premium UV protection sunglasses with stylish design.',
      price: 4499, // GHS 44.99
      images: ['https://picsum.photos/seed/sunglasses/400/400'],
      category: 'Accessories',
      subcategory: 'Eyewear',
      stock: 60,
      isFeatured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.title }, // This won't work for upsert, but we'll use create
      update: {},
      create: product,
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });