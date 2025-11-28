import { SignJWT, jwtVerify } from 'jose';

// Secret key for JWT - should be stored in environment variables
const getSecretKey = (): string => {
  const secret = process.env.ADMIN_JWT_SECRET || 'fallback_secret_for_development';
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not set in environment variables');
  }
  return secret;
};

const getSecretKeyAsBuffer = (): Uint8Array => {
  const secret = getSecretKey();
  return new TextEncoder().encode(secret);
};

// Function to generate a JWT token for admin authentication
export async function generateAdminToken(adminId: string): Promise<string> {
  const secret = getSecretKeyAsBuffer();
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')  // Token expires in 7 days
    .sign(secret);

  return token;
}

// Function to verify the admin token
export async function verifyAdminToken(token: string | undefined): Promise<{ adminId: string } | null> {
  if (!token) {
    return null;
  }

  try {
    const secret = getSecretKeyAsBuffer();
    const verified = await jwtVerify(token, secret);
    return { adminId: verified.payload.adminId as string };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}