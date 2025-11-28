import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { members } from '@/lib/db/schema';

const db = getDb();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, mobile, email, dob, education, permanentAddress, image, donated, type } = body;

    // Validate required fields
    if (!name || !address || !mobile || !email || !dob || !education || !permanentAddress) {
      return Response.json({
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const parsedDob = dob ? new Date(dob) : null;
    const formattedDob = parsedDob ? parsedDob.toISOString().split('T')[0] : null;

    const [newMember] = await db
      .insert(members)
      .values({
        name,
        address,
        mobile,
        email,
        dob: formattedDob,
        education,
        permanentAddress,
        image: image || null,
        donated: donated !== undefined ? donated : 0,
        type: type || 'member',
      })
      .returning();

    return Response.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error registering member:', error);
    return Response.json({ error: 'Failed to register member' }, { status: 500 });
  }
}