import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { getDb } from '@/src/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return new Response('Database not configured', { status: 500 });
  }

  const sql = getDb();

  let lastCheck = new Date().toISOString();

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          clearInterval(interval);
        }
      };

      send(JSON.stringify({ type: 'connected', message: 'SSE connected' }));

      const interval = setInterval(async () => {
        try {
          const notifications = await sql`
            SELECT id, type, title, message, reference_id, is_read, created_at
            FROM notifications
            WHERE created_at > ${lastCheck}::timestamptz
            ORDER BY created_at ASC
          ` as {
            id: string;
            type: string;
            title: string;
            message: string;
            reference_id: string;
            is_read: boolean;
            created_at: string;
          }[];

          if (notifications.length > 0) {
            for (const notif of notifications) {
              send(JSON.stringify({ type: 'notification', data: notif }));
            }
            lastCheck = notifications[notifications.length - 1].created_at;
          }
        } catch (err) {
          console.error('[SSE] Polling error:', err);
        }
      }, 4000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
