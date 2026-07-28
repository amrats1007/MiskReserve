import crypto from 'crypto';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { AuthSessionPayload, User } from '@/lib/types';

const SECRET_KEY = process.env.SESSION_SECRET || 'misk-reserve-sec-key-prod-2026';

const HASH_ITERATIONS = 600000;
const LEGACY_HASH_ITERATIONS = 1000;

// Hash Password using PBKDF2 with 600,000 iterations
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify Password against stored salt:hash (supports both 600k and legacy 1k iterations)
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  
  // Try current 600k iterations
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, 64, 'sha512').toString('hex');
  if (hash === originalHash) return true;

  // Fallback try legacy 1k iterations for existing accounts
  const legacyHash = crypto.pbkdf2Sync(password, salt, LEGACY_HASH_ITERATIONS, 64, 'sha512').toString('hex');
  return legacyHash === originalHash;
}

// Create Signed Token payload
export function createToken(payload: AuthSessionPayload): string {
  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(dataStr).digest('base64url');
  return `${dataStr}.${signature}`;
}

// Verify Signed Token
export function verifyToken(token: string): AuthSessionPayload | null {
  try {
    const [dataStr, signature] = token.split('.');
    if (!dataStr || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(dataStr).digest('base64url');
    if (signature !== expectedSignature) return null;

    const payloadStr = Buffer.from(dataStr, 'base64url').toString('utf8');
    return JSON.parse(payloadStr) as AuthSessionPayload;
  } catch (err) {
    return null;
  }
}

// Helper to check valid approved session for API routes
export async function checkAuthSession(): Promise<{ authenticated: boolean; user?: User }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('misk_auth_session')?.value;
    if (!token) return { authenticated: false };

    const payload = verifyToken(token);
    if (!payload || !payload.id) return { authenticated: false };

    const users = await sql`SELECT id, name, email, entity_name, phone, role, status FROM users WHERE id = ${payload.id};`;
    if (users.length === 0 || users[0].status !== 'approved') {
      return { authenticated: false };
    }

    return { authenticated: true, user: users[0] as User };
  } catch (err) {
    return { authenticated: false };
  }
}
