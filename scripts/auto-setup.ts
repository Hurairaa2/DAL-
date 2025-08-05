import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Automatic AdminFlow Setup\n');

console.log('📋 Setting up your admin panel with SQLite database...\n');

// Create .env file with SQLite configuration
const envPath = join(process.cwd(), '.env');
const envContent = `# Database Configuration - SQLite (works immediately)
DATABASE_URL="file:./dev.db"

# Server Configuration
PORT=3001
NODE_ENV=development

# This uses SQLite which requires no additional setup.
# To upgrade to PostgreSQL later, replace the DATABASE_URL above.
`;

writeFileSync(envPath, envContent);
console.log('✅ Created .env file with SQLite configuration');

console.log('\n🔄 Setting up database...');

try {
  // Create database tables
  console.log('📊 Creating database tables...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  // Seed with sample data
  console.log('🌱 Seeding database with sample data...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('✅ Database setup completed successfully!');
  
  console.log('\n🚀 Starting the development server...');
  console.log('Your admin panel will be available at: http://localhost:3001\n');
  
  // Start the development server
  execSync('npm run dev', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Error during setup:', error);
  console.log('\n🔧 Manual setup instructions:');
  console.log('1. Run: npm run db:push');
  console.log('2. Run: npm run db:seed');
  console.log('3. Run: npm run dev');
  console.log('\n🌐 Your admin panel will be available at: http://localhost:3001');
}

console.log('\n📚 Next Steps:');
console.log('1. Your admin panel is now running with SQLite database');
console.log('2. To upgrade to PostgreSQL:');
console.log('   - Get a free database from https://neon.tech');
console.log('   - Update the DATABASE_URL in .env file');
console.log('   - Restart the server');
console.log('\n3. Explore the admin panel at http://localhost:3001'); 