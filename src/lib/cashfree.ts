import { Cashfree, CFEnvironment } from "cashfree-pg";

if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
  throw new Error("Cashfree credentials not found in environment variables");
}

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  process.env.NODE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  // CFEnvironment.PRODUCTION,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET,
);

export default cashfree;
