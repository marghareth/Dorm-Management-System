import { getSupabaseServer } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('users')
      .select(`
        user_id, fname, mname, lname, email, phone, created_at,
        emergency_contacts (contact_id, contact_name, contact_phone, relationship)
      `)
      .order('lname');

    if (error) throw error;
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch dormers' }, { status: 500 });
  }
}

