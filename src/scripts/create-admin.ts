import { getDb } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

const db = getDb();

// Load environment variables
config({ path: '.env.local' });

async function createAdminUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if admin user already exists
    const existingAdmin = await db.select().from(admins).where(
      eq(admins.username, 'admin')
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Insert the admin user
    await db.insert(admins).values({
      username: 'admin',
      password: hashedPassword,
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createAdminUser();
}