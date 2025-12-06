import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { jwtVerify, SignJWT } from "jose";
import { getDb } from "@/lib/db";
import * as authSchema from "@/lib/db/auth-schema";

const db = getDb();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    usePlural: true,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "user",
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 365, // 1 year
    updateAge: 60 * 60 * 24 * 7, // Update every 7 days
  },
  rateLimit: {
    window: 60,
    max: 10,
  },
  plugins: [nextCookies()],
});

// Generate JWT token for admin authentication
export async function generateAdminToken(adminId: string) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_secret_key_for_development",
  );

  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}

// Verify admin token
export async function verifyAdminToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret_key_for_development",
    );

    const { payload } = await jwtVerify(token, secret);
    return { valid: true, payload };
  } catch (_error) {
    return { valid: false, payload: null };
  }
}
