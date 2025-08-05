import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Setting up AdminFlow with PostgreSQL...\n');

// Check if .env file exists
const envPath = join(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Database Configuration
# Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/adminflow"

# Server Configuration
PORT=3001
NODE_ENV=development

# Example connection strings:
# Local PostgreSQL: postgresql://username:password@localhost:5432/adminflow
# Neon Database: postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/adminflow?sslmode=require
# Supabase: postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
`;

  writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
  console.log('⚠️  Please update the DATABASE_URL in .env with your actual PostgreSQL connection string\n');
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
if (!existsSync(join(process.cwd(), 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

console.log('\n📋 Next steps:');
console.log('1. Update the DATABASE_URL in your .env file with your PostgreSQL connection string');
console.log('2. Run: npm run db:push (to create database tables)');
console.log('3. Run: npm run db:seed (to populate with sample data)');
console.log('4. Run: npm run dev (to start the development server)');
console.log('\n🌐 Your admin panel will be available at: http://localhost:3001');

console.log('\n📚 For more information, see DATABASE_SETUP.md'); 