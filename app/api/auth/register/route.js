import { getSupabaseServer } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export async function POST(request) {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      phone,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    } = await request.json();

    if (!firstName || !lastName || !email || !password || !phone) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    const { data: existing } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return Response.json({ message: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ fname: firstName, mname: middleName || null, lname: lastName, email, phone, password_hash: hashedPassword })
      .select('user_id')
      .single();

    if (error) throw error;

    if (emergencyContactName && emergencyContactPhone) {
      await supabase.from('emergency_contacts').insert({
        user_id: newUser.user_id,
        contact_name: emergencyContactName,
        contact_phone: emergencyContactPhone,
        relationship: emergencyContactRelationship || null,
      });
    }

    const fullName = middleName
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`;

    const token = generateToken(newUser.user_id);
    return Response.json(
      { token, user: { userId: newUser.user_id, fullName, email, phone, role: 'dormer' } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return Response.json({ message: 'Registration failed' }, { status: 500 });
  }
}