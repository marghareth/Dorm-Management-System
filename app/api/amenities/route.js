import { getSupabaseServer } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('name');

    if (error) throw error;
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch amenities' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabaseServer();
    const { name, description } = await request.json();

    if (!name) return Response.json({ message: 'Name is required' }, { status: 400 });

    const { data, error } = await supabase
      .from('amenities')
      .insert({ name, description: description || null })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return Response.json({ message: 'Amenity already exists' }, { status: 409 });
      throw error;
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to add amenity' }, { status: 500 });
  }
}