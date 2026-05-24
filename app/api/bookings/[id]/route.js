import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const bookingId = params.id;
    const { status } = await request.json();

    if (!status) {
      return Response.json({ message: 'Status is required' }, { status: 400 });
    }

    await query('UPDATE bookings SET status = $1 WHERE booking_id = $2', [status, bookingId]);
    return Response.json({ message: 'Booking status updated' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const bookingId = params.id;
    await query('DELETE FROM bookings WHERE booking_id = $1', [bookingId]);
    return Response.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}
