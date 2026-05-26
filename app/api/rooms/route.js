import { getSupabaseServer } from '@/lib/supabase';

export async function GET(request) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const floor = searchParams.get('floor');

    let query = supabase
      .from('rooms')
      .select(`*, room_amenities(amenities(name))`)
      .order('floor')
      .order('room_number');

    if (floor) query = query.eq('floor', floor);

    const { data, error } = await query;
    if (error) throw error;

    const result = data.map(r => ({
      ...r,
      amenities: r.room_amenities?.map(ra => ra.amenities?.name).filter(Boolean) || [],
    }));

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch rooms' }, { status: 500 });
  }
}