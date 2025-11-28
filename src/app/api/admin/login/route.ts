import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const db = getDb();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Find the admin user
    const adminUsers = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username));

    if (adminUsers.length === 0) {
      return Response.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const admin = adminUsers[0];
    
    // Compare the password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return Response.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Login successful
    return Response.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}