import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", (t) => ({
  id: t.text().primaryKey().notNull(),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.boolean().notNull().default(false),
  image: t
    .text()
    .default(
      "https://res.cloudinary.com/ahcloud/image/upload/v1747277562/images/default-profile_bpnjdl_dzyvud.png",
    )
    .notNull(),
  role: t.text().default("user").notNull().$type<"user" | "admin">(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const accounts = pgTable("accounts", (t) => ({
  id: t.text().primaryKey().notNull(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: t.text(),
  refreshToken: t.text(),
  idToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  password: t.text(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const sessions = pgTable("sessions", (t) => ({
  id: t.text().primaryKey().notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: t.text().notNull().unique(),
  ipAddress: t.text(),
  userAgent: t.text(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const verifications = pgTable("verifications", (t) => ({
  id: t.text().primaryKey().notNull(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));
