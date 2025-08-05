import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Automated PostgreSQL Database Setup\n');

console.log('📋 This script will help you set up a free PostgreSQL database.');
console.log('We\'ll use Neon (neon.tech) which offers a free tier.\n');

console.log('⚠️  IMPORTANT: You need to manually create a Neon database first.');
console.log('Follow these steps:\n');

console.log('1. Go to https://neon.tech');
console.log('2. Sign up for a free account');
console.log('3. Create a new project');
console.log('4. Copy your connection string from the dashboard\n');

console.log('Once you have your connection string, we can continue.\n');

// Check if .env exists and has a valid DATABASE_URL
const envPath = join(process.cwd(), '.env');
let envContent = '';

if (existsSync(envPath)) {
  envContent = readFileSync(envPath, 'utf-8');
  
  // Check if DATABASE_URL is already set and not the default
  if (envContent.includes('DATABASE_URL=') && 
      !envContent.includes('postgresql://username:password@localhost:5432/adminflow')) {
    console.log('✅ Found existing DATABASE_URL in .env file');
    
    // Extract the current DATABASE_URL
    const match = envContent.match(/DATABASE_URL="([^"]+)"/);
    if (match) {
      console.log('Current DATABASE_URL:', match[1].replace(/:[^:@]*@/, ':****@'));
      
      const answer = await askQuestion('Do you want to use this existing connection? (y/n): ');
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('✅ Using existing database connection');
        await proceedWithSetup();
        return;
      }
    }
  }
}

console.log('Please provide your PostgreSQL connection string:');
console.log('Format: postgresql://username:password@host:port/database');
console.log('Example: postgresql://user:pass@ep-xxx-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require\n');

// For now, let's create a local PostgreSQL setup guide
console.log('🔧 Alternative: Set up local PostgreSQL\n');

console.log('If you prefer to use a local PostgreSQL database:');
console.log('1. Install PostgreSQL on your machine');
console.log('2. Create a database: CREATE DATABASE adminflow;');
console.log('3. Update the .env file with: DATABASE_URL="postgresql://username:password@localhost:5432/adminflow"\n');

console.log('📝 For now, I\'ll create a sample .env file that you can update manually.\n');

// Create/update .env file
const sampleEnvContent = `# Database Configuration
# Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/adminflow"

# Server Configuration
PORT=3001
NODE_ENV=development

# Example connection strings:
# Local PostgreSQL: postgresql://username:password@localhost:5432/adminflow
# Neon Database: postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/adminflow?sslmode=require
# Supabase: postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres

# To get a free database:
# 1. Visit https://neon.tech and create a free account
# 2. Create a new project
# 3. Copy the connection string and replace the DATABASE_URL above
`;

writeFileSync(envPath, sampleEnvContent);
console.log('✅ Created .env file with sample configuration');

console.log('\n📋 Next steps:');
console.log('1. Get a free PostgreSQL database from https://neon.tech');
console.log('2. Update the DATABASE_URL in .env with your connection string');
console.log('3. Run: npm run db:push (to create database tables)');
console.log('4. Run: npm run db:seed (to populate with sample data)');
console.log('5. Run: npm run dev (to start the development server)');

console.log('\n🌐 Your admin panel will be available at: http://localhost:3001');

// Helper function to ask questions (simplified for now)
async function askQuestion(question: string): Promise<string> {
  // In a real implementation, this would use readline or a similar library
  // For now, we'll just return a default answer
  return 'n';
}

async function proceedWithSetup() {
  console.log('\n🔄 Proceeding with database setup...');
  
  try {
    console.log('📊 Creating database tables...');
    execSync('npm run db:push', { stdio: 'inherit' });
    
    console.log('🌱 Seeding database with sample data...');
    execSync('npm run db:seed', { stdio: 'inherit' });
    
    console.log('✅ Database setup completed successfully!');
    console.log('🚀 You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Error during database setup:', error);
    console.log('Please check your DATABASE_URL and try again.');
  }
} 