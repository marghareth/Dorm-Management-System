import { getSupabaseServer } from '@/lib/supabase';

export async function GET(request) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        rooms (room_number, type, floor, price),
        users (fname, mname, lname, email)
      `)
      .order('created_at', { ascending: false });

    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) throw error;

    const result = data.map(b => ({
      ...b,
      room_number: b.rooms?.room_number,
      type: b.rooms?.type,
      floor: b.rooms?.floor,
      price: b.rooms?.price,
      amount_due: b.rooms?.price * b.num_months,
      full_name: b.users?.mname
        ? `${b.users.fname} ${b.users.mname} ${b.users.lname}`
        : `${b.users?.fname} ${b.users?.lname}`,
      email: b.users?.email,
    }));

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabaseServer();
    const { userId, roomId, checkIn, checkOut, numMonths, numOccupants, specialRequests } = await request.json();

    if (!userId || !roomId || !checkIn || !checkOut || !numMonths || !numOccupants) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        num_months: numMonths,
        num_occupants: numOccupants,
        special_requests: specialRequests || null,
      })
      .select('booking_id')
      .single();

    if (error) throw error;
    return Response.json({ message: 'Booking submitted', bookingId: data.booking_id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to submit booking' }, { status: 500 });
  }
}