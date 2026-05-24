import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const amenityId = params.id;
    const { name } = await request.json();

    if (!name) {
      return Response.json({ message: 'Name is required' }, { status: 400 });
    }

    await query('UPDATE amenities SET name = $1 WHERE amenity_id = $2', [name, amenityId]);
    return Response.json({ message: 'Amenity updated successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update amenity' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const amenityId = params.id;
    await query('DELETE FROM amenities WHERE amenity_id = $1', [amenityId]);
    return Response.json({ message: 'Amenity deleted successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete amenity' }, { status: 500 });
  }
}
