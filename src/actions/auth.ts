"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
    // query: { disableCookieCache: true },
  });
  return session;
};

export { getUserSession };
