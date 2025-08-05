import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all users or search users
        const { search } = req.query;
        if (search && typeof search === 'string') {
          const users = await db.searchUsers(search);
          res.status(200).json(users);
        } else {
          const users = await db.getUsers();
          res.status(200).json(users);
        }
        break;

      case 'POST':
        // Create new user
        const { name, email } = req.body;
        
        if (!name || !email) {
          return res.status(400).json({ error: 'Name and email are required' });
        }

        const newUser = await db.createUser(name, email);
        res.status(201).json(newUser);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 