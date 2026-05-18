import { query } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const result = await query(
      `SELECT u.user_id, u.full_name, u.email, u.role, u.password_hash,
              d.dormer_id, d.program, d.year_level
       FROM users u
       LEFT JOIN dormers d ON u.user_id = d.user_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];

    if (!verifyPassword(password, user.password_hash)) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken(user.user_id, user.role);
    return Response.json({
      token,
      user: {
        userId:    user.user_id,
        fullName:  user.full_name,
        email:     user.email,
        role:      user.role,
        dormerId:  user.dormer_id,
        program:   user.program,
        yearLevel: user.year_level,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Login failed' }, { status: 500 });
  }
}
