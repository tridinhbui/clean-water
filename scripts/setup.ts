#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('🌊 Setting up CleanWater Scan project...\n');

// Check if required environment variables exist
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

console.log('📋 Checking environment variables...');
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env.local file');
} else {
  console.log('📝 Creating .env.local file...');
  
  const envTemplate = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cleanwater"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: External APIs
OPENAI_API_KEY="your-openai-api-key"
MAPBOX_TOKEN="your-mapbox-token"
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
}

// Check for missing environment variables
const missingVars = requiredEnvVars.filter(varName => {
  return !envContent.includes(varName) || envContent.includes(`${varName}="your-`);
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Please update these environment variables in .env.local:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error);
  process.exit(1);
}

// Setup database
console.log('\n🗄️  Setting up database...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
  
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema applied');
  
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Database seeded with sample data');
} catch (error) {
  console.warn('⚠️  Database setup failed. You may need to configure your database connection first.');
  console.warn('   Update DATABASE_URL in .env.local and run: npm run db:setup');
}

// Create necessary directories
console.log('\n📁 Creating directories...');
const directories = [
  'public/icons',
  'public/screenshots',
  'uploads',
  'logs'
];

directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create PWA icons (placeholder)
console.log('\n🎨 Setting up PWA assets...');
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(process.cwd(), 'public');

iconSizes.forEach(size => {
  const iconPath = path.join(publicDir, 'icons', `icon-${size}x${size}.png`);
  if (!fs.existsSync(iconPath)) {
    // Create placeholder icon (we would normally generate real icons here)
    const placeholderSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3B82F6"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="${size/6}">💧</text>
</svg>`;
    fs.writeFileSync(iconPath, placeholderSvg);
  }
});

console.log('✅ PWA assets prepared');

// Build the project
console.log('\n🏗️  Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Project built successfully');
} catch (error) {
  console.warn('⚠️  Build failed. This is normal if environment variables are not set up yet.');
  console.warn('   Complete the .env.local setup and run: npm run build');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update environment variables in .env.local');
console.log('2. Set up your database (PostgreSQL recommended)');
console.log('3. Run: npm run db:setup');
console.log('4. Run: npm run dev');
console.log('\n🌊 Happy water testing!');

export {}; 