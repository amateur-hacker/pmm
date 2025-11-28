import { getDb } from '@/lib/db';
import { members, blogs } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { generateMockMembers, generateMockBlogs } from '@/lib/mock-data';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function seedDatabase() {
  const db = getDb();

  try {
    console.log('Starting to seed the database...');

    // Generate mock data
    const mockMembers = generateMockMembers(50);
    const mockBlogs = generateMockBlogs(50);

    // Clear existing data (optional - remove if you want to keep existing data)
    await db.delete(members);
    await db.delete(blogs);

    // Insert members
    for (const member of mockMembers) {
      await db.insert(members).values({
        id: uuidv4(), // Generate a new UUID for each member
        name: member.name,
        address: member.address,
        mobile: member.mobile,
        email: member.email,
        dob: member.dob,
        education: member.education,
        permanentAddress: member.permanentAddress,
        image: member.image,
        donated: member.donated,
        type: member.type,
        createdAt: new Date(member.createdAt),
        updatedAt: new Date(member.updatedAt),
      });
    }

    console.log(`Inserted ${mockMembers.length} members`);

    // Insert blogs
    for (const blog of mockBlogs) {
      await db.insert(blogs).values({
        id: uuidv4(), // Generate a new UUID for each blog
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        published: blog.published,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : null,
        image: blog.image,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
      });
    }

    console.log(`Inserted ${mockBlogs.length} blogs`);
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}