import crypto from 'crypto';

const SECRET_KEY = process.env.SESSION_SECRET || 'misk-reserve-super-secret-key-2026';

// Hash Password using PBKDF2
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify Password against stored salt:hash
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// Create Signed Token payload
export function createToken(payload: object): string {
  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(dataStr).digest('base64url');
  return `${dataStr}.${signature}`;
}

// Verify Signed Token
export function verifyToken(token: string): any | null {
  try {
    const [dataStr, signature] = token.split('.');
    if (!dataStr || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(dataStr).digest('base64url');
    if (signature !== expectedSignature) return null;

    const payloadStr = Buffer.from(dataStr, 'base64url').toString('utf8');
    return JSON.parse(payloadStr);
  } catch (err) {
    return null;
  }
}
