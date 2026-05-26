import crypto from 'crypto';
import { query } from './db.js';

const AUTH_SECRET = process.env.AUTH_SECRET || 'default-auth-secret';
const DIGEST = 'sha256';
const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function signPayload(payload) {
  return crypto.createHmac(DIGEST, AUTH_SECRET).update(payload).digest('hex');
}

export function generateToken(userId) {
  const payload = JSON.stringify({ userId, iat: Date.now() });
  const signature = signPayload(payload);
  return Buffer.from(`${payload}.${signature}`).toString('base64');
}

export function parseToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [payload, signature] = decoded.split('.');
    if (!payload || !signature) return null;

    const expectedSignature = signPayload(payload);
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
    if (!isValid) return null;

    const data = JSON.parse(payload);
    if (!data || typeof data.userId !== 'number') return null;
    if (Date.now() - data.iat > TOKEN_EXPIRATION_MS) return null;

    return data;
  } catch {
    return null;
  }
}

export async function getUserFromToken(token) {
  if (!token) return null;
  const parsed = parseToken(token);
  if (!parsed) return null;

  const result = await query(
    `SELECT user_id, fname, mname, lname, email, phone
     FROM users
     WHERE user_id = $1`,
    [parsed.userId]
  );
  return result.rows[0] || null;
}