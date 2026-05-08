import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, contactNumber } = await request.json();

    if (!firstName || !lastName || !email || !password || !contactNumber) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return Response.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Insert new user
    const result = await query(
      'INSERT INTO users (first_name, last_name, email, password, contact_number, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [firstName, lastName, email, password, contactNumber]
    );

    const userId = result.insertId;

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    return Response.json(
      {
        token,
        user: {
          id: userId,
          email,
          firstName,
          lastName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return Response.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
