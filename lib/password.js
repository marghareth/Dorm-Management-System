import crypto from 'crypto';

export function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + process.env.PASSWORD_SALT || 'default-salt')
    .digest('hex');
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}
