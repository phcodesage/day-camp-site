import { NextResponse } from 'next/server';
import { connectToDatabase, getMongoErrorMessage } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  const url = new URL(request.url);
  const limitRaw = url.searchParams.get('limit');
  const limitParsed = limitRaw ? Number(limitRaw) : 50;
  const limit = Number.isFinite(limitParsed)
    ? Math.min(Math.max(limitParsed, 1), 200)
    : 50;

  try {
    await connectToDatabase();

    const items = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      items: items.map((item) => ({
        _id: item._id.toString(),
        parentName: item.parentName,
        studentName: item.studentName,
        email: item.email,
        phone: item.phone,
        activities: item.activities,
        preferredDays: item.preferredDays,
        notes: item.notes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Admin registrations fetch failed:', error);
    return NextResponse.json(
      {
        error: getMongoErrorMessage(error, 'Could not load registrations.'),
      },
      { status: 500 }
    );
  }
}
