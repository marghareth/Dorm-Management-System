import { getSupabaseServer } from '@/lib/supabase';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServer();

    const { error } = await supabase
      .from('amenities')
      .delete()
      .eq('amenity_id', id);

    if (error) throw error;
    return Response.json({ message: 'Amenity deleted successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete amenity' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServer();
    const { name, description } = await request.json();

    if (!name) return Response.json({ message: 'Name is required' }, { status: 400 });

    const { error } = await supabase
      .from('amenities')
      .update({ name, description: description || null })
      .eq('amenity_id', id);

    if (error) throw error;
    return Response.json({ message: 'Amenity updated successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update amenity' }, { status: 500 });
  }
}