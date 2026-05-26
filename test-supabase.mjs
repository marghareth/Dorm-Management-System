import { getSupabaseServer } from './lib/supabase.js';
import fs from 'fs';
import path from 'path';

function loadDotenv(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [k, ...rest] = trimmed.split('=');
      const v = rest.join('=').replace(/^"|"$/g, '');
      if (!(k in process.env)) process.env[k] = v;
    });
  } catch (e) {
    // ignore
  }
}

loadDotenv(path.resolve(process.cwd(), '.env'));

(async () => {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.from('users').select('user_id,email').limit(5);
    if (error) throw error;
    console.log('supabase users sample:', data);
  } catch (err) {
    console.error('supabase error:', err);
    process.exit(1);
  }
})();
