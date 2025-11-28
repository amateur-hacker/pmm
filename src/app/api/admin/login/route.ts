import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";

const db = getDb();

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    // Find the admin user
    const adminUsers = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username));

    if (adminUsers.length === 0) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    const admin = adminUsers[0];

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Generate JWT token for admin
    const token = await generateAdminToken(admin.id);

    // Create response with success message
    const response = Response.json({
      message: "Login successful",
      adminId: admin.id,
    });

    // Set the token in a cookie
    cookieStore.set("adminToken", token, {
      httpOnly: process.env.NODE_ENV === "production", // Not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict", // CSRF protection
      path: "/", // Available for the entire site
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "An error occurred during login" },
      { status: 500 },
    );
  }
}
