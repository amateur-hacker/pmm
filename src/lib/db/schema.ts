import { pgTable, uuid, text, varchar, timestamp, date, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  mobile: varchar('mobile', { length: 20 }),
  email: varchar('email', { length: 255 }),
  dob: date('dob'),
  education: varchar('education', { length: 255 }),
  permanentAddress: text('permanent_address'),
  image: varchar('image', { length: 500 }), // Optional image URL
  donated: integer('donated').default(0), // Donated field with default value of 0
  type: varchar('type', { length: 50 }).default('member').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // Will store hashed passwords
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const blogs = pgTable('blogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(), // Markdown content
  excerpt: text('excerpt'), // Short description
  author: varchar('author', { length: 255 }).notNull(),
  published: integer('published').default(0), // 0 for draft, 1 for published
  publishedAt: timestamp('published_at'),
  image: varchar('image', { length: 500 }), // Optional featured image
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});