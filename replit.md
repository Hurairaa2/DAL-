# Loan Management System

## Overview

This is a comprehensive loan management system built with React frontend and Node.js/Express backend. The application manages loan providers, applicants, loan applications, and provides audit logging and reporting capabilities. It features a modern dashboard interface for monitoring loan operations and administrative tasks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern component patterns
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management, caching, and data synchronization
- **React Hook Form** with Zod validation for form handling and validation
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Shadcn/ui** component library for consistent UI components built on Radix UI primitives

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **In-memory storage** implementation (MemStorage class) that can be easily swapped for database integration
- RESTful API design with proper HTTP status codes and error handling
- Middleware for request logging, JSON parsing, and error handling
- Modular route organization with separate storage abstraction layer

### Data Storage Strategy
- **Drizzle ORM** configured for PostgreSQL with schema definitions in shared directory
- Database schema includes tables for loan providers, applicants, loan applications, and audit logs
- Prepared for Neon Database integration based on configuration
- Currently using in-memory storage with interface that matches database operations

### Component Design Patterns
- Shared schema definitions between frontend and backend using Zod
- Form components with consistent validation patterns
- Reusable data table component with sorting, searching, and action capabilities
- Modal dialogs for CRUD operations with proper state management
- Dashboard widgets for metrics and recent activity display

### State Management
- TanStack Query for server state with optimistic updates
- React Hook Form for form state management
- Component-level state for UI interactions
- Toast notifications for user feedback

### Styling Architecture
- CSS custom properties for theming with light/dark mode support
- Utility-first approach with Tailwind CSS
- Component-specific styles using CSS modules pattern
- Responsive design with mobile-first approach

## External Dependencies

### Core Framework Dependencies
- **React 18** - Frontend framework
- **Express.js** - Backend web framework
- **TypeScript** - Type system for both frontend and backend
- **Vite** - Frontend build tool and development server

### Database and ORM
- **Drizzle ORM** - Type-safe database toolkit
- **@neondatabase/serverless** - Neon Database client for PostgreSQL
- **connect-pg-simple** - PostgreSQL session store for Express

### UI and Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Utility for creating variant-based component APIs

### Form Handling and Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### Data Fetching and State
- **TanStack React Query** - Data fetching and caching library
- **Wouter** - Lightweight routing for React

### Development Tools
- **ESBuild** - Fast JavaScript bundler for production builds
- **PostCSS** - CSS processing tool
- **Autoprefixer** - CSS vendor prefixing

### Utility Libraries
- **date-fns** - Date utility library
- **clsx** - Conditional className utility
- **nanoid** - URL-safe unique string ID generator