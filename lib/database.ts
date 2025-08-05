import pool from './db';

// Database utility functions
export const db = {
  // Get all users
  async getUsers() {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  },

  // Get user by ID
  async getUserById(id: number) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Create new user
  async createUser(name: string, email: string) {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  },

  // Update user
  async updateUser(id: number, name: string, email: string) {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    return result.rows[0];
  },

  // Delete user
  async deleteUser(id: number) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Search users
  async searchUsers(searchTerm: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1',
      [`%${searchTerm}%`]
    );
    return result.rows;
  }
};

// Example SQL for creating the users table
export const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Initialize database tables
export async function initDatabase() {
  try {
    await pool.query(createUsersTable);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 