import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { roomId, amenityId } = await request.json();
    await query(
      'INSERT INTO room_amenities (room_id, amenity_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [roomId, amenityId]
    );
    return Response.json({ message: 'Amenity assigned to room' }, { status: 201 });
  } catch (error) {
    return Response.json({ message: 'Failed to assign amenity' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { roomId, amenityId } = await request.json();
    await query(
      'DELETE FROM room_amenities WHERE room_id = $1 AND amenity_id = $2',
      [roomId, amenityId]
    );
    return Response.json({ message: 'Amenity removed from room' });
  } catch (error) {
    return Response.json({ message: 'Failed to remove amenity' }, { status: 500 });
  }
}
