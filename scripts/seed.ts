import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser1 = await prisma.user.upsert({
    where: { email: 'demo@cleanwater.com' },
    update: {},
    create: {
      email: 'demo@cleanwater.com',
      password: hashedPassword,
    },
  });

  const demoUser2 = await prisma.user.upsert({
    where: { email: 'tester@cleanwater.com' },
    update: {},
    create: {
      email: 'tester@cleanwater.com',
      password: hashedPassword,
    },
  });

  console.log('👤 Created demo users');

  // Create sample water quality data
  const sampleData = [
    {
      userId: demoUser1.id,
      lat: 37.7749,
      lng: -122.4194,
      metrics: {
        pH: 7.2,
        chlorine: 0.8,
        heavyMetalScore: 2.1,
        turbidity: 0.5,
      },
    },
    {
      userId: demoUser1.id,
      lat: 37.7849,
      lng: -122.4094,
      metrics: {
        pH: 6.8,
        chlorine: 1.2,
        heavyMetalScore: 3.4,
        turbidity: 1.2,
      },
    },
    {
      userId: demoUser1.id,
      lat: 37.7649,
      lng: -122.4294,
      metrics: {
        pH: 8.1,
        chlorine: 0.3,
        heavyMetalScore: 8.7,
        turbidity: 2.8,
      },
    },
    {
      userId: demoUser2.id,
      lat: 40.7128,
      lng: -74.0060,
      metrics: {
        pH: 7.5,
        chlorine: 0.6,
        heavyMetalScore: 1.8,
        turbidity: 0.3,
      },
    },
    {
      userId: demoUser2.id,
      lat: 40.7228,
      lng: -74.0160,
      metrics: {
        pH: 6.3,
        chlorine: 1.8,
        heavyMetalScore: 9.2,
        turbidity: 4.5,
      },
    },
  ];

  for (const sample of sampleData) {
    await prisma.sample.create({
      data: sample,
    });
  }

  console.log('🧪 Created sample water quality data');
  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Demo credentials:');
  console.log('Email: demo@cleanwater.com');
  console.log('Email: tester@cleanwater.com');
  console.log('Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
 