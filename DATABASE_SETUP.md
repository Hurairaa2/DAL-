# Database Setup Guide

This admin panel now uses PostgreSQL as the database backend with Drizzle ORM.

## Prerequisites

1. **PostgreSQL Database**: You need a PostgreSQL database running locally or in the cloud
2. **Node.js**: Version 16 or higher
3. **npm**: For package management

## Database Options

### Option 1: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE adminflow;
   ```
3. Set your connection string in `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/adminflow"
   ```

### Option 2: Cloud PostgreSQL (Recommended)

#### Neon Database (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string and add it to your `.env` file

#### Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database to get your connection string

#### Railway
1. Go to [railway.app](https://railway.app)
2. Create an account
3. Create a new PostgreSQL service
4. Copy the connection string

## Setup Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create Environment File**:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="your_postgresql_connection_string_here"
   PORT=3001
   NODE_ENV=development
   ```

3. **Run Database Migrations**:
   ```bash
   npm run db:push
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Database Schema

The application includes the following tables:
- `loan_providers`: Financial institutions that provide loans
- `applicants`: People applying for loans
- `loan_applications`: Loan applications with status tracking
- `audit_logs`: System audit trail

## Troubleshooting

### Connection Issues
- Ensure your PostgreSQL server is running
- Check that your connection string is correct
- Verify that your database exists
- Make sure your user has the necessary permissions

### Migration Issues
- If you get schema conflicts, you may need to drop and recreate your database
- Ensure you're using the latest version of the schema

### Environment Variables
- Make sure your `.env` file is in the root directory
- Verify that `DATABASE_URL` is set correctly
- Restart your development server after changing environment variables

## Development

The application uses:
- **Drizzle ORM**: For database operations
- **PostgreSQL**: As the database backend
- **TypeScript**: For type safety
- **Express.js**: For the API server

All database operations are handled through the `PostgresStorage` class in `server/postgres-storage.ts`. 