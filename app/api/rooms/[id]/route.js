import { getSupabaseServer } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('rooms')
      .select(`*, room_amenities(amenities(name))`)
      .eq('room_id', params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return Response.json({ message: 'Room not found' }, { status: 404 });

    return Response.json({
      ...data,
      amenities: data.room_amenities?.map(ra => ra.amenities?.name).filter(Boolean) || [],
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch room' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const supabase = getSupabaseServer();
    const { price, capacity, status } = await request.json();
    const { error } = await supabase
      .from('rooms')
      .update({ price, capacity, status })
      .eq('room_id', params.id);

    if (error) throw error;
    return Response.json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from('rooms').delete().eq('room_id', params.id);
    if (error) throw error;
    return Response.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete room' }, { status: 500 });
  }
}