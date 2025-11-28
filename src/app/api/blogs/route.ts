import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

const db = getDb();

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Check if this is an admin request (for drafts)
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const isAdmin = token === 'admin_session_token';

    if (url.searchParams.has('page') || url.searchParams.has('limit')) {
      // This is a request for pagination (from the public blogs page)
      let baseQuery;
      let totalQuery;

      if (isAdmin) {
        // Admin can see all blogs (published and drafts)
        baseQuery = db
          .select()
          .from(blogs)
          .orderBy(desc(blogs.createdAt))
          .limit(limit)
          .offset(offset);

        totalQuery = db
          .select({ count: sql<number>`count(*)` }) // Count all blogs
          .from(blogs);
      } else {
        // Regular users can only see published blogs
        baseQuery = db
          .select()
          .from(blogs)
          .where(eq(blogs.published, 1))
          .orderBy(desc(blogs.createdAt))
          .limit(limit)
          .offset(offset);

        totalQuery = db
          .select({ count: sql<number>`count(*)` }) // Count only published blogs
          .from(blogs)
          .where(eq(blogs.published, 1));
      }

      // Execute both queries
      const [items, totalRows] = await Promise.all([
        baseQuery,
        totalQuery
      ]);

      // Check if there are more items beyond the current page
      const total = totalRows.length > 0 ? totalRows[0].count : 0;
      const hasMore = (page * limit) < total;

      return Response.json({
        items,
        hasMore,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    } else {
      // This is a request without pagination parameters (from admin dashboard)
      let query;
      if (isAdmin) {
        // Admin can see all blogs (published and drafts)
        query = await db
          .select()
          .from(blogs)
          .orderBy(desc(blogs.createdAt));
      } else {
        // Regular users can only see published blogs
        query = await db
          .select()
          .from(blogs)
          .where(eq(blogs.published, 1))
          .orderBy(desc(blogs.createdAt));
      }

      return Response.json(query);
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check for admin authentication
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (token !== 'admin_session_token') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, excerpt, author, published, image } = body;

    // Validate required fields
    if (!title || !content || !author) {
      return Response.json({
        error: 'Missing required fields: title, content, author'
      }, { status: 400 });
    }

    const parsedPublished = published ? 1 : 0;
    const publishedAt = parsedPublished ? new Date() : null;

    const [newBlog] = await db
      .insert(blogs)
      .values({
        title,
        content,
        excerpt,
        author,
        published: parsedPublished,
        publishedAt,
        image: image || null,
      })
      .returning();

    return Response.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return Response.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}