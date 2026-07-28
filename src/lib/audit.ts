import { sql } from '@/lib/db';

export async function logAudit({
  userId,
  userName,
  action,
  targetType,
  targetId,
  details,
  ipAddress
}: {
  userId?: number;
  userName?: string;
  action: string;
  targetType: string;
  targetId?: string | number;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await sql`
      INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details, ip_address)
      VALUES (
        ${userId || null},
        ${userName || 'System'},
        ${action},
        ${targetType},
        ${targetId ? String(targetId) : null},
        ${details || null},
        ${ipAddress || null}
      );
    `;
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
}
