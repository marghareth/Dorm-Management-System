import { getSupabaseServer } from '@/lib/supabase';

export async function POST(request) {
  try {
    const supabase = getSupabaseServer();
    const { roomId, amenityId, quantity } = await request.json();

    const { error } = await supabase
      .from('room_amenities')
      .upsert({ room_id: roomId, amenity_id: amenityId, quantity: quantity || 1 });

    if (error) throw error;
    return Response.json({ message: 'Amenity assigned to room' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to assign amenity' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const supabase = getSupabaseServer();
    const { roomId, amenityId } = await request.json();

    const { error } = await supabase
      .from('room_amenities')
      .delete()
      .eq('room_id', roomId)
      .eq('amenity_id', amenityId);

    if (error) throw error;
    return Response.json({ message: 'Amenity removed from room' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to remove amenity' }, { status: 500 });
  }
}