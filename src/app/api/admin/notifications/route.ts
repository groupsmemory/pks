import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { getDb } from '@/src/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ notifications: [] });
  }

  const sql = getDb();

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const unreadOnly = searchParams.get('unread') === 'true';

  const condition = unreadOnly ? sql`WHERE is_read = false` : sql``;

  const notifications = await sql`
    SELECT id, type, title, message, reference_id, is_read, created_at
    FROM notifications
    ${condition}
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  ` as any[];

  const countResult = await sql`
    SELECT COUNT(*) as total FROM notifications ${condition}
  ` as any[];

  let unread: number | undefined;
  if (!unreadOnly) {
    const unreadResult = await sql`SELECT COUNT(*) as c FROM notifications WHERE is_read = false` as any[];
    unread = Number(unreadResult[0]?.c || 0);
  }

  return NextResponse.json({
    notifications,
    total: Number(countResult[0]?.total || 0),
    unread,
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
  }

  const sql = getDb();
  const body = await req.json();
  const { ids } = body as { ids?: string[] };

  if (ids && ids.length > 0) {
    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE id = ANY(${ids}::uuid[])
    `;
  } else {
    await sql`
      UPDATE notifications SET is_read = true WHERE is_read = false
    `;
  }

  return NextResponse.json({ success: true });
}
