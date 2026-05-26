import fs from 'fs';
import path from 'path';
import pg from 'pg';

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

(async () => {
  // load .env from repo root
  loadDotenv(path.resolve(process.cwd(), '.env'));

  const cfg = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  };

  console.log('Attempting DB connect with config:', {
    host: cfg.host,
    port: cfg.port,
    database: cfg.database,
    user: cfg.user,
  });

  const client = new pg.Client(cfg);
  try {
    await client.connect();
    const res = await client.query('SELECT now() as now');
    console.log('Query result:', res.rows);
    await client.end();
    console.log('Success');
  } catch (err) {
    console.error('Detailed error:');
    console.error(err);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
})();