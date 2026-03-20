import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageView from '@/lib/models/PageView';
import Visit from '@/lib/models/Visit';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';

export const runtime = 'nodejs';

export async function GET() {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();

    const [totalPageViews, totalVisits, visitsByDeviceRaw] = await Promise.all(
      [
        PageView.countDocuments(),
        Visit.countDocuments(),
        Visit.aggregate([
          { $group: { _id: '$device', count: { $sum: 1 } } },
          { $project: { device: '$_id', count: 1, _id: 0 } },
        ]),
      ]
    );

    const visitsByDevice = visitsByDeviceRaw
      .filter(
        (item: { device: unknown; count: unknown }) =>
          typeof item.device === 'string' && typeof item.count === 'number'
      )
      .map((item: { device: string; count: number }) => ({
        device: item.device,
        count: item.count,
      }));

    return NextResponse.json({
      totalPageViews,
      totalVisits,
      visitsByDevice,
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: 'Database error.' },
        { status: 500 }
      );
    }

    console.error('Analytics summary failed:', error);
    return NextResponse.json(
      { error: 'Could not load analytics.' },
      { status: 500 }
    );
  }
}

