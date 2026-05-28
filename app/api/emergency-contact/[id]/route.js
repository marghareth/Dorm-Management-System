import { getSupabaseServer } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServer();
    const { contactName, contactPhone, relationship } = await request.json();

    const { data: existing, error: selectError } = await supabase
      .from('emergency_contacts')
      .select('contact_id')
      .eq('user_id', id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error } = await supabase.from('emergency_contacts').update({
        contact_name: contactName || null,
        contact_phone: contactPhone || null,
        relationship: relationship || null,
      }).eq('user_id', id);
      if (error) throw error;
    } else {
      if (!contactName && !contactPhone && !relationship) {
        return Response.json({ message: 'No emergency contact changes' });
      }
      const { error } = await supabase.from('emergency_contacts').insert({
        user_id: parseInt(id),
        contact_name: contactName || null,
        contact_phone: contactPhone || null,
        relationship: relationship || null,
      });
      if (error) throw error;
    }

    return Response.json({ message: 'Emergency contact saved successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to save emergency contact' }, { status: 500 });
  }
}