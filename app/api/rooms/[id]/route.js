import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const floor = searchParams.get('floor');

    let sql = `
      SELECT r.*,
        COALESCE(
          json_agg(a.name ORDER BY a.name) FILTER (WHERE a.name IS NOT NULL),
          '[]'
        ) AS amenities
      FROM rooms r
      LEFT JOIN room_amenities ra ON r.room_id = ra.room_id
      LEFT JOIN amenities a ON ra.amenity_id = a.amenity_id
    `;
    const params = [];
    if (floor) { sql += ' WHERE r.floor = $1'; params.push(floor); }
    sql += ' GROUP BY r.room_id ORDER BY r.floor, r.room_number';

    const result = await query(sql, params);
    return Response.json(result.rows);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { roomNumber, type, floor, capacity, price, status } = await request.json();
    if (!roomNumber || !type || !floor || !capacity || !price) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }
    const result = await query(
      `INSERT INTO rooms (room_number, type, floor, capacity, price, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [roomNumber, type, floor, capacity, price, status || 'available']
    );
    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    if (error.code === '23505') return Response.json({ message: 'Room number already exists' }, { status: 409 });
    return Response.json({ message: 'Failed to add room' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const roomId = params.id;
    const { price, capacity, status } = await request.json();

    await query(
      `UPDATE rooms SET price = $1, capacity = $2, status = $3 WHERE room_id = $4`,
      [price, capacity, status, roomId]
    );

    return Response.json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const roomId = params.id;
    await query('DELETE FROM rooms WHERE room_id = $1', [roomId]);
    return Response.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete room' }, { status: 500 });
  }
}
