import { query } from './db.js';

// Simple token: base64(userId:role:timestamp)
export function generateToken(userId, role) {
  return Buffer.from(`${userId}:${role}:${Date.now()}`).toString('base64');
}

export function parseToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [userId, role] = decoded.split(':');
    return { userId: parseInt(userId), role };
  } catch {
    return null;
  }
}

export async function getUserFromToken(token) {
  if (!token) return null;
  const parsed = parseToken(token);
  if (!parsed) return null;

  const result = await query(
    `SELECT u.user_id, u.full_name, u.email, u.phone, u.role,
            d.dormer_id, d.program, d.year_level
     FROM users u
     LEFT JOIN dormers d ON u.user_id = d.user_id
     WHERE u.user_id = $1`,
    [parsed.userId]
  );
  return result.rows[0] || null;
}
