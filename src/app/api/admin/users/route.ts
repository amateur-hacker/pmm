// /src/app/api/admin/users/route.ts

import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/auth-schema";

const db = getDb();

// GET /api/admin/users - Fetch all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get session to verify admin access
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    // Fetch all users from the database
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    return Response.json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// POST /api/admin/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Get session to verify admin access
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    const { name, email, role } = await request.json();

    // Validate input
    if (!name || !email) {
      return new Response("Name and email are required", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return new Response("User with this email already exists", {
        status: 409,
      });
    }

    // Create the new user
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        emailVerified: false,
        role: role || "user", // Default to 'user' if no role provided
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return Response.json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
