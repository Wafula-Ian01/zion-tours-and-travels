import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.bookingInquiry.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.creditation.deleteMany();
  await prisma.category.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.blogArticle.deleteMany();
  await prisma.travelPackage.deleteMany();
  await prisma.cMSSettings.deleteMany();
  await prisma.adminUser.deleteMany();

  console.log('✅ Cleared existing data');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({
    data: {
      username: 'admin',
      email: 'admin@ziontraintours.com',
      password: hashedPassword,
      role: 'admin'
    }
  });
  console.log('✅ Created admin user (username: admin, password: admin123)');

  // Create CMS Settings
  await prisma.cMSSettings.create({
    data: {
      companyName: 'Zion Train Tours & Travel Uganda',
      companyEmail: 'info@ziontraintours.com',
      companyPhone: '+256 700 123 456',
      whatsappNumber: '+256 700 123 456',
      aboutContent: 'Discover the beauty of Uganda with Zion Train Tours & Travel. We offer unforgettable safari experiences, cultural tours, and adventure travel across East Africa.',
      facebook: 'https://facebook.com/ziontraintours',
      instagram: 'https://instagram.com/ziontraintours',
      twitter: 'https://twitter.com/ziontraintours'
    }
  });
  console.log('✅ Created CMS settings');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Wildlife Safaris', slug: 'wildlife' } }),
    prisma.category.create({ data: { name: 'Beach Holidays', slug: 'beach' } }),
    prisma.category.create({ data: { name: 'Mountain Treks', slug: 'mountain' } }),
    prisma.category.create({ data: { name: 'Cultural Tours', slug: 'cultural' } })
  ]);
  console.log('✅ Created categories');

  // Create travel packages
  await Promise.all([
    prisma.travelPackage.create({
      data: {
        title: 'Gorilla Trekking Adventure',
        description: 'Experience the thrill of encountering mountain gorillas in Bwindi Impenetrable Forest.',
        price: '$1,500',
        duration: '3 Days',
        category: 'wildlife',
        details: 'This package includes gorilla permits, accommodation, meals, and professional guides.',
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800'
      }
    }),
    prisma.travelPackage.create({
      data: {
        title: 'Zanzibar Beach Escape',
        description: 'Relax on pristine beaches with crystal clear waters and white sand.',
        price: '$1,200',
        duration: '5 Days',
        category: 'beach',
        details: 'Includes beachfront accommodation, water sports, and island tours.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
      }
    }),
    prisma.travelPackage.create({
      data: {
        title: 'Mount Kilimanjaro Expedition',
        description: 'Conquer Africa\'s highest peak with experienced mountain guides.',
        price: '$2,500',
        duration: '7 Days',
        category: 'mountain',
        details: 'Full trekking support, camping equipment, meals, and summit certificate.',
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50b0?w=800'
      }
    }),
    prisma.travelPackage.create({
      data: {
        title: 'Cultural Heritage Tour',
        description: 'Immerse yourself in the rich cultural traditions of Uganda.',
        price: '$800',
        duration: '4 Days',
        category: 'cultural',
        details: 'Visit local communities, traditional ceremonies, and craft markets.',
        image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'
      }
    })
  ]);
  console.log('✅ Created travel packages');

  // Create blog articles
  await Promise.all([
    prisma.blogArticle.create({
      data: {
        title: 'Best Time to Visit Uganda for Wildlife',
        excerpt: 'Learn about the optimal seasons for wildlife viewing in Uganda.',
        content: 'Uganda offers incredible wildlife experiences year-round, but certain seasons are better for specific activities...',
        author: 'Sarah Johnson',
        date: new Date(),
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800'
      }
    }),
    prisma.blogArticle.create({
      data: {
        title: '10 Essential Items for Your Safari',
        excerpt: 'A comprehensive packing list for your African safari adventure.',
        content: 'Preparing for a safari requires careful consideration of what to pack...',
        author: 'Mike Williams',
        date: new Date(),
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800'
      }
    })
  ]);
  console.log('✅ Created blog articles');

  // Create FAQs
  await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'What vaccinations do I need for Uganda?',
        answer: 'Yellow fever vaccination is mandatory. We also recommend hepatitis A & B, typhoid, and malaria prophylaxis.'
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do I need a visa to visit Uganda?',
        answer: 'Most visitors can obtain a visa on arrival or apply for an e-visa online before travel.'
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'What is the best time to see gorillas?',
        answer: 'Gorilla trekking is available year-round, but the dry seasons (June-August and December-February) offer easier hiking conditions.'
      }
    })
  ]);
  console.log('✅ Created FAQs');

  // Create creditations
  await Promise.all([
    prisma.creditation.create({ data: { name: 'Licensed Tour Operator', icon: 'Award' } }),
    prisma.creditation.create({ data: { name: 'Certified Guides', icon: 'Shield' } }),
    prisma.creditation.create({ data: { name: 'Eco-Tourism Certified', icon: 'Leaf' } }),
    prisma.creditation.create({ data: { name: '24/7 Customer Support', icon: 'Phone' } })
  ]);
  console.log('✅ Created creditations');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });