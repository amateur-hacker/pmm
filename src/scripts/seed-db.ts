import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/db";
import { events, members } from "@/lib/db/schema";
import { generateMockEvents, generateMockMembers } from "@/lib/mock-data";

// Load environment variables
config({ path: ".env" });

async function seedDatabase() {
  const db = getDb();

  try {
    console.log("Starting to seed the database...");

    // Generate mock data
    const mockMembers = generateMockMembers(50);
    const mockEvents = generateMockEvents(50);

    // Clear existing data (optional - remove if you want to keep existing data)
    await db.delete(members); // Commented out to preserve existing members
    await db.delete(events);

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

    // Insert events
    for (const event of mockEvents) {
      await db.insert(events).values({
        id: uuidv4(), // Generate a new UUID for each event
        title: event.title,
        content: event.content,
        excerpt: event.excerpt,
        author: event.author,
        published: event.published,
        publishedAt: event.publishedAt ? new Date(event.publishedAt) : null,
        image: event.image,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      });
    }

    console.log(`Inserted ${mockEvents.length} events`);
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
