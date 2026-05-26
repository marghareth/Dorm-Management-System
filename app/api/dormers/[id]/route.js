import { getSupabaseServer } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('users')
      .select(`
        user_id, fname, mname, lname, email, phone,
        emergency_contacts (contact_id, contact_name, contact_phone, relationship)
      `)
      .eq('user_id', params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return Response.json({ message: 'Dormer not found' }, { status: 404 });
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch dormer' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const supabase = getSupabaseServer();
    const { phone, emergencyContactName, emergencyContactPhone, emergencyContactRelationship } = await request.json();

    await supabase.from('users').update({ phone: phone || null }).eq('user_id', params.id);

    const { data: existing } = await supabase
      .from('emergency_contacts')
      .select('contact_id')
      .eq('user_id', params.id)
      .maybeSingle();

    if (existing) {
      await supabase.from('emergency_contacts').update({
        contact_name: emergencyContactName || null,
        contact_phone: emergencyContactPhone || null,
        relationship: emergencyContactRelationship || null,
      }).eq('user_id', params.id);
    } else if (emergencyContactName && emergencyContactPhone) {
      await supabase.from('emergency_contacts').insert({
        user_id: parseInt(params.id),
        contact_name: emergencyContactName,
        contact_phone: emergencyContactPhone,
        relationship: emergencyContactRelationship || null,
      });
    }

    return Response.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from('users').delete().eq('user_id', params.id);
    if (error) throw error;
    return Response.json({ message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to delete account' }, { status: 500 });
  }
}