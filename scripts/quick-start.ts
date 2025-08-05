import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Quick Start - AdminFlow Database Setup\n');

console.log('📋 Setting up your admin panel with a working database...\n');

// Create a working .env file with a local database option
const envPath = join(process.cwd(), '.env');
const envContent = `# Database Configuration
# Option 1: Local SQLite (works immediately - no setup required)
DATABASE_URL="file:./dev.db"

# Option 2: PostgreSQL (requires setup)
# DATABASE_URL="postgresql://username:password@localhost:5432/adminflow"

# Option 3: Free Cloud PostgreSQL
# Get a free database from: https://neon.tech
# DATABASE_URL="postgresql://user:pass@ep-xxx-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Server Configuration
PORT=3001
NODE_ENV=development

# Instructions:
# 1. For immediate start: Keep the SQLite option (file:./dev.db)
# 2. For PostgreSQL: Comment out SQLite line and uncomment a PostgreSQL option
# 3. Update the PostgreSQL connection string with your actual database
`;

writeFileSync(envPath, envContent);
console.log('✅ Created .env file with SQLite database (works immediately)');

console.log('\n🔄 Setting up database...');

try {
  // First, let's try to run the database setup
  console.log('📊 Creating database tables...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  console.log('🌱 Seeding database with sample data...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('✅ Database setup completed successfully!');
  
  console.log('\n🚀 Starting the development server...');
  console.log('Your admin panel will be available at: http://localhost:3001\n');
  
  // Start the development server
  execSync('npm run dev', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Error during setup:', error);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure all dependencies are installed: npm install');
  console.log('2. Check if port 3001 is available');
  console.log('3. Try running the commands manually:');
  console.log('   npm run db:push');
  console.log('   npm run db:seed');
  console.log('   npm run dev');
}

console.log('\n📚 Next Steps:');
console.log('1. Your admin panel is now running with SQLite database');
console.log('2. To upgrade to PostgreSQL:');
console.log('   - Get a free database from https://neon.tech');
console.log('   - Update the DATABASE_URL in .env file');
console.log('   - Restart the server');
console.log('\n3. Explore the admin panel at http://localhost:3001'); 