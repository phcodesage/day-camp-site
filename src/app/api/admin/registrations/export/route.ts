import { NextResponse } from 'next/server';
import { connectToDatabase, getMongoErrorMessage } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';

export const runtime = 'nodejs';

function formatTimestamp(value: Date | string) {
  return new Date(value).toISOString();
}

function formatNotes(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return 'None';
  }

  return value
    .trim()
    .split(/\r?\n/)
    .map((line) => `  ${line}`)
    .join('\n');
}

export async function GET() {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();

    const items = await Registration.find().sort({ createdAt: -1 }).lean();
    const exportedAt = new Date();
    const fileDate = exportedAt.toISOString().slice(0, 10);

    const body = [
      'Kids After School Registrations',
      `Generated: ${exportedAt.toISOString()}`,
      `Total registrations: ${items.length}`,
      '',
      ...items.flatMap((item, index) => [
        `Registration ${index + 1}`,
        `Submitted: ${formatTimestamp(item.createdAt)}`,
        `Updated: ${formatTimestamp(item.updatedAt)}`,
        `Parent Name: ${item.parentName}`,
        `Student Name: ${item.studentName}`,
        `Email: ${item.email}`,
        `Phone: ${item.phone}`,
        `Activities: ${item.activities.join(', ')}`,
        `Preferred Days: ${item.preferredDays}`,
        'Notes:',
        formatNotes(item.notes),
        '',
        '----------------------------------------',
        '',
      ]),
    ].join('\n');

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="registrations-${fileDate}.txt"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Admin registrations export failed:', error);
    return NextResponse.json(
      {
        error: getMongoErrorMessage(
          error,
          'Could not export registrations.'
        ),
      },
      { status: 500 }
    );
  }
}
