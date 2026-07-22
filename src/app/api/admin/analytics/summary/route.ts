import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageView from '@/lib/models/PageView';
import Visit from '@/lib/models/Visit';
import Registration from '@/lib/models/Registration';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';

export const runtime = 'nodejs';

export async function GET() {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();

    const [totalPageViews, totalVisits, totalRegistrations, visitsByDeviceRaw] =
      await Promise.all([
        PageView.countDocuments(),
        Visit.countDocuments(),
        Registration.countDocuments(),
        Visit.aggregate([
          { $group: { _id: '$device', count: { $sum: 1 } } },
          { $project: { device: '$_id', count: 1, _id: 0 } },
          { $sort: { count: -1, device: 1 } },
        ]),
      ]);

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
      totalRegistrations,
      visitsByDevice,
    });
  } catch (error: any) {
    console.warn('Analytics summary database read failed (non-blocking):', error?.message || error);
    return NextResponse.json({
      totalPageViews: 0,
      totalVisits: 0,
      totalRegistrations: 0,
      visitsByDevice: [],
      warning: 'Database offline or unconfigured.',
    });
  }
}
