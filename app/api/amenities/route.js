import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM amenities ORDER BY name');
    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ message: 'Failed to fetch amenities' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    if (!name) return Response.json({ message: 'Name is required' }, { status: 400 });
    const result = await query(
      'INSERT INTO amenities (name) VALUES ($1) RETURNING *', [name]
    );
    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    if (error.code === '23505') return Response.json({ message: 'Amenity already exists' }, { status: 409 });
    return Response.json({ message: 'Failed to add amenity' }, { status: 500 });
  }
}
