import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Delete the admin token cookie
    cookieStore.delete("adminToken");

    // Create response with success message
    const response = Response.json({
      message: "Logout successful",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json(
      { error: "An error occurred during logout" },
      { status: 500 },
    );
  }
}