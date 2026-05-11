import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT u.user_id, u.full_name, u.email, u.phone, u.created_at,
              d.dormer_id, d.program, d.year_level
       FROM users u
       JOIN dormers d ON u.user_id = d.user_id
       WHERE u.role = 'dormer'
       ORDER BY u.full_name`
    );
    return Response.json(result.rows);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch dormers' }, { status: 500 });
  }
}
