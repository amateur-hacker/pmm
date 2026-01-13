import {
  date,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  dob: date("dob").notNull(),
  education: varchar("education", { length: 255 }).notNull(),
  permanentAddress: text("permanent_address").notNull(),
  image: varchar("image", { length: 500 }).notNull(), // Required image URL
  donated: integer("donated").notNull(), // Donated field with default value of 0
  type: varchar("type", { length: 50 }).default("member").notNull(),
  membershipStatus: varchar("membership_status", { length: 20 })
    .default("active")
    .notNull(),
  membershipStartDate: timestamp("membership_start_date")
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentHistory = pgTable("payment_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  memberId: uuid("member_id")
    .references(() => members.id)
    .notNull(),
  orderId: varchar("order_id", { length: 255 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("INR").notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Will store hashed passwords
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // Markdown content
  excerpt: text("excerpt"), // Short description
  author: varchar("author", { length: 255 }).notNull(),
  published: integer("published").default(0), // 0 for draft, 1 for published
  publishedAt: timestamp("published_at"),
  image: varchar("image", { length: 500 }), // Optional featured image
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export all schemas for Drizzle migration
export * from "./auth-schema";
