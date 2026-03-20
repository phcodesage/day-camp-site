import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { connectToDatabase, getMongoErrorMessage } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { requireAdminOrJsonResponse } from '@/lib/admin/requireAdmin';

export const runtime = 'nodejs';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = requireAdminOrJsonResponse();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const result = await Registration.deleteOne({ _id: id });

    return NextResponse.json({
      ok: true,
      deletedCount: result.deletedCount || 0,
    });
  } catch (error) {
    console.error('Admin registration delete failed:', error);
    return NextResponse.json(
      {
        error: getMongoErrorMessage(error, 'Could not delete registration.'),
      },
      { status: 500 }
    );
  }
}
