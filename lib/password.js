import crypto from 'crypto';

export function hashPassword(password) {
  const salt = process.env.PASSWORD_SALT || 'default-salt';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}
