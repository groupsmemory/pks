import { neon } from '@neondatabase/serverless';
import { UTApi } from 'uploadthing/server';

interface KtaRecord {
  id: string;
  ktp_image_base64: string | null;
  ktp_image_type: string | null;
  profile_image_base64: string | null;
  profile_image_type: string | null;
}

function toFilename(recordId: string, type: 'ktp' | 'profile'): string {
  const ext = type === 'ktp' ? 'ktp' : 'profile';
  return `kta-${recordId.slice(0, 8)}-${ext}.jpg`;
}

function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  if (!process.env.UPLOADTHING_TOKEN) {
    console.error('UPLOADTHING_TOKEN not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const utapi = new UTApi();

  const records = await sql`
    SELECT id, ktp_image_base64, ktp_image_type, profile_image_base64, profile_image_type
    FROM kta_registrations
    WHERE (ktp_image_base64 IS NOT NULL AND ktp_image_base64 != '' AND ktp_image_base64 NOT LIKE 'http%')
       OR (profile_image_base64 IS NOT NULL AND profile_image_base64 != '' AND profile_image_base64 NOT LIKE 'http%')
    ORDER BY created_at ASC
  ` as KtaRecord[];

  console.log(`Found ${records.length} records with base64 images to migrate.`);

  let migrated = 0;
  let errors = 0;

  for (const record of records) {
    try {
      let newKtpUrl = record.ktp_image_base64?.startsWith('http')
        ? record.ktp_image_base64
        : null;
      let newProfileUrl = record.profile_image_base64?.startsWith('http')
        ? record.profile_image_base64
        : null;

      // Migrate KTP image
      if (
        !newKtpUrl &&
        record.ktp_image_base64 &&
        record.ktp_image_base64.length > 0
      ) {
        const ktpBuffer = base64ToBuffer(record.ktp_image_base64);
        const ktpFile = new File([ktpBuffer], toFilename(record.id, 'ktp'), {
          type: record.ktp_image_type || 'image/jpeg',
        });
        const ktpResult = await utapi.uploadFiles(ktpFile);
        if (ktpResult.data) {
          newKtpUrl = ktpResult.data.url;
          console.log(`  ✓ KTP ${record.id.slice(0, 8)} → ${newKtpUrl}`);
        } else if (ktpResult.error) {
          console.error(`  ✗ KTP ${record.id.slice(0, 8)} error:`, ktpResult.error);
        }
      }

      // Migrate Profile image
      if (
        !newProfileUrl &&
        record.profile_image_base64 &&
        record.profile_image_base64.length > 0
      ) {
        const profileBuffer = base64ToBuffer(record.profile_image_base64);
        const profileFile = new File([profileBuffer], toFilename(record.id, 'profile'), {
          type: record.profile_image_type || 'image/jpeg',
        });
        const profileResult = await utapi.uploadFiles(profileFile);
        if (profileResult.data) {
          newProfileUrl = profileResult.data.url;
          console.log(`  ✓ Profile ${record.id.slice(0, 8)} → ${newProfileUrl}`);
        } else if (profileResult.error) {
          console.error(`  ✗ Profile ${record.id.slice(0, 8)} error:`, profileResult.error);
        }
      }

      // Update DB if any URL changed
      if (newKtpUrl || newProfileUrl) {
        const setClauses: string[] = [];
        const params: (string | null)[] = [];
        let idx = 1;

        if (newKtpUrl && newKtpUrl !== record.ktp_image_base64) {
          setClauses.push(`ktp_image_base64 = $${idx++}`);
          params.push(newKtpUrl);
          setClauses.push(`ktp_image_type = $${idx++}`);
          params.push('url');
        }
        if (newProfileUrl && newProfileUrl !== record.profile_image_base64) {
          setClauses.push(`profile_image_base64 = $${idx++}`);
          params.push(newProfileUrl);
          setClauses.push(`profile_image_type = $${idx++}`);
          params.push('url');
        }

        if (setClauses.length > 0) {
          params.push(record.id);
          await sql.query(
            `UPDATE kta_registrations SET ${setClauses.join(', ')} WHERE id = $${idx}`,
            params,
          );
        }
      }

      migrated++;
    } catch (err) {
      errors++;
      console.error(`  ✗ Error migrating ${record.id.slice(0, 8)}:`, err);
    }
  }

  console.log(`\nMigration complete: ${migrated} migrated, ${errors} errors.`);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
