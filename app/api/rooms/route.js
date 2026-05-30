// app/api/rooms/route.js
import { getSupabaseServer } from '@/lib/supabase';

export async function GET(request) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const floor = searchParams.get('floor');

    let query = supabase
      .from('rooms')
      .select(`*, room_amenities(amenities(name, description))`)
      .order('floor')
      .order('room_number');

    if (floor) query = query.eq('floor', floor);

    const { data, error } = await query;
    if (error) throw error;

    const result = data.map(r => ({
      ...r,
      amenities: r.room_amenities
        ?.map(ra => ra.amenities
          ? { name: ra.amenities.name, description: ra.amenities.description || '' }
          : null
        )
        .filter(Boolean) || [],
    }));

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabaseServer();
    const { roomNumber, type, floor, capacity, price, status } = await request.json();

    if (!roomNumber || !type || !floor || !capacity || !price) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        room_number: roomNumber,
        type,
        floor:    parseInt(floor),
        capacity: parseInt(capacity),
        price:    parseFloat(price),
        status:   status || 'available',
      })
      .select('room_id')
      .single();

    if (error) throw error;
    return Response.json({ message: 'Room added successfully', roomId: data.room_id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to add room' }, { status: 500 });
  }
}