import { getSupabaseServer } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, fname, mname, lname, email, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const fullName = user.mname
      ? `${user.fname} ${user.mname} ${user.lname}`
      : `${user.fname} ${user.lname}`;

    const managerEmail = process.env.MANAGER_EMAIL || 'manager@xanelledorms.com';
    const role = user.email === managerEmail ? 'manager' : 'dormer';

    const token = generateToken(user.user_id);
    return Response.json({
      token,
      user: { userId: user.user_id, fullName, email: user.email, role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Login failed' }, { status: 500 });
  }
}