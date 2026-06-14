import { getDb } from '@/src/lib/db';

type NotificationType = 'aspirasi_baru' | 'kta_baru';

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string;
}

export async function createNotification({
  type,
  title,
  message,
  referenceId,
}: CreateNotificationParams) {
  if (!process.env.DATABASE_URL) return;

  const sql = getDb();

  await sql`
    INSERT INTO notifications (type, title, message, reference_id)
    VALUES (${type}, ${title}, ${message}, ${referenceId})
  `;
}
