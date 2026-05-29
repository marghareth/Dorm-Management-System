import { getSupabaseServer } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServer();
    const { status } = await request.json();

    if (!status) return Response.json({ message: 'Status is required' }, { status: 400 });

    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', id);

    if (error) throw error;
    return Response.json({ message: 'Booking status updated' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServer();

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('booking_id', id);

    if (error) throw error;
    return Response.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}