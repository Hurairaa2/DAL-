# AdminFlow - Loan Management Admin Panel

A modern, full-stack admin panel for managing loan applications, built with React, TypeScript, Express.js, and PostgreSQL.

## 🚀 Features

- **Loan Provider Management**: Add, edit, and manage financial institutions
- **Applicant Management**: Track loan applicants and their information
- **Loan Application Tracking**: Monitor application status and progress
- **Audit Logging**: Complete audit trail of all system activities
- **Dashboard Analytics**: Real-time statistics and insights
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the stack

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tools**: Vite, ESBuild
- **Development**: Hot reload, TypeScript compilation

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL database (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd AdminFlow
npm run setup
```

### 2. Configure Database

Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/adminflow"
```

### 3. Initialize Database

```bash
npm run db:push    # Create database tables
npm run db:seed    # Populate with sample data
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) to access your admin panel.

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE adminflow;
   ```
3. Update your `.env` file with the connection string

### Option 2: Cloud PostgreSQL (Recommended)

#### Neon Database (Free Tier)
- Visit [neon.tech](https://neon.tech)
- Create a free account and project
- Copy the connection string to your `.env` file

#### Supabase (Free Tier)
- Visit [supabase.com](https://supabase.com)
- Create a free account and project
- Get your connection string from Settings > Database

## 📊 Database Schema

The application includes these main tables:

- **loan_providers**: Financial institutions that provide loans
- **applicants**: People applying for loans
- **loan_applications**: Loan applications with status tracking
- **audit_logs**: System audit trail

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema
npm run db:seed      # Seed database with sample data
npm run setup        # Initial setup wizard
```

## 📁 Project Structure

```
AdminFlow/
├── client/                 # Frontend React application
├── server/                 # Backend Express.js server
│   ├── db.ts              # Database connection
│   ├── postgres-storage.ts # PostgreSQL storage implementation
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
├── scripts/               # Utility scripts
│   ├── setup.ts           # Setup wizard
│   └── seed-database.ts   # Database seeding
└── migrations/            # Database migrations (auto-generated)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_postgresql_connection_string"
PORT=3001
NODE_ENV=development
```

### Database Configuration

The application uses Drizzle ORM for database operations. The schema is defined in `shared/schema.ts` and migrations are handled automatically.

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set these environment variables in production:

- `DATABASE_URL`: Your production PostgreSQL connection string
- `NODE_ENV`: Set to "production"
- `PORT`: Your desired port (default: 3001)

## 🐛 Troubleshooting

### Database Connection Issues

1. Verify your `DATABASE_URL` is correct
2. Ensure your PostgreSQL server is running
3. Check that your database exists and is accessible
4. Verify user permissions

### Migration Issues

If you encounter schema conflicts:

```bash
# Drop and recreate your database
npm run db:push
npm run db:seed
```

### Common Issues

- **Port already in use**: Change the `PORT` in your `.env` file
- **Database not found**: Create the database first
- **Permission denied**: Check your database user permissions

## 📚 Documentation

- [Database Setup Guide](DATABASE_SETUP.md) - Detailed database configuration
- [API Documentation](docs/api.md) - API endpoints and usage
- [Schema Reference](docs/schema.md) - Database schema documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the documentation
3. Open an issue on GitHub

---

Built with ❤️ using modern web technologies 