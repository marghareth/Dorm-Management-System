import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Query database for user
    const result = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (result.length === 0) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result[0];

    // For now, simple password validation (in production, use bcrypt)
    if (user.password !== password) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return Response.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
