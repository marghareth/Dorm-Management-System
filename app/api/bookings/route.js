import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dormerId = searchParams.get('dormer_id');

    let sql = `
      SELECT b.*, r.room_number, r.type, r.floor, r.price,
             u.full_name, u.email, d.program, d.year_level
      FROM bookings b
      JOIN rooms r ON b.room_id = r.room_id
      JOIN dormers d ON b.dormer_id = d.dormer_id
      JOIN users u ON d.user_id = u.user_id
    `;
    const params = [];
    if (dormerId) { sql += ' WHERE b.dormer_id = $1'; params.push(dormerId); }
    sql += ' ORDER BY b.created_at DESC';

    const result = await query(sql, params);
    return Response.json(result.rows);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { dormerId, roomId, checkIn, checkOut, numMonths, numOccupants, specialRequests } = await request.json();
    if (!dormerId || !roomId || !checkIn || !checkOut || !numMonths || !numOccupants) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }
    const result = await query(
      `INSERT INTO bookings (dormer_id, room_id, check_in, check_out, num_months, num_occupants, special_requests)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING booking_id`,
      [dormerId, roomId, checkIn, checkOut, numMonths, numOccupants, specialRequests || null]
    );
    return Response.json({ message: 'Booking submitted', bookingId: result.rows[0].booking_id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to submit booking' }, { status: 500 });
  }
}
