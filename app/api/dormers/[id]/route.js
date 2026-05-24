import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    const result = await query(
      `SELECT u.user_id, u.full_name, u.email, u.phone,
              d.dormer_id, d.program, d.year_level
       FROM users u
       LEFT JOIN dormers d ON u.user_id = d.user_id
       WHERE u.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return Response.json({ message: 'Dormer not found' }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch dormer' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = params.id;
    const { phone, program, yearLevel } = await request.json();

    await query(
      `UPDATE users SET phone = $1 WHERE user_id = $2`,
      [phone || null, userId]
    );

    await query(
      `UPDATE dormers SET program = $1, year_level = $2 WHERE user_id = $3`,
      [program || null, yearLevel || null, userId]
    );

    return Response.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = params.id;
    await query('DELETE FROM users WHERE user_id = $1', [userId]);
    return Response.json({ message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete account' }, { status: 500 });
  }
}
