import { query } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, phone, program, yearLevel } = await request.json();

    if (!firstName || !lastName || !email || !password || !phone) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return Response.json({ message: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);
    const userResult = await query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'dormer') RETURNING user_id`,
      [`${firstName} ${lastName}`, email, phone, hashedPassword]
    );
    const userId = userResult.rows[0].user_id;

    await query(
      `INSERT INTO dormers (user_id, program, year_level) VALUES ($1, $2, $3)`,
      [userId, program || null, yearLevel || null]
    );

    const token = generateToken(userId, 'dormer');
    return Response.json(
      { token, user: { userId, fullName: `${firstName} ${lastName}`, email, role: 'dormer' } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return Response.json({ message: 'Registration failed' }, { status: 500 });
  }
}
