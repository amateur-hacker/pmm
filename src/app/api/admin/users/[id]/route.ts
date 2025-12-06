// /src/app/api/admin/users/[id]/route.ts

import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/auth-schema";

const db = getDb();

// Define a schema for user updates
const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

// PUT /api/admin/users/[id] - Update a user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Get session to verify admin access
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    const { id } = await params;

    // Validate the user ID
    if (!id) {
      return new Response("User ID is required", { status: 400 });
    }

    const body = await request.json();
    const validationResult = updateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        `Validation error: ${validationResult.error.issues.map((e) => e.message).join(", ")}`,
        { status: 400 },
      );
    }

    const { name, email, role } = validationResult.data;

    // Update the user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        updatedAt: new Date(), // Update the timestamp
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      return new Response("User not found", { status: 404 });
    }

    return Response.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete a user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Get session to verify admin access
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    const { id } = await params;

    // Validate the user ID
    if (!id) {
      return new Response("User ID is required", { status: 400 });
    }

    // Delete the user
    const result = await db.delete(users).where(eq(users.id, id));

    if (result.rowCount === 0) {
      return new Response("User not found", { status: 404 });
    }

    return new Response("User deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
