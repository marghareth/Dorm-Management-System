import pg from 'pg';

let pool;

function getPool() {
  if (!pool) {
    pool = new pg.Pool({
      host:     process.env.DB_HOST,
      port:     parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 5000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query(text, params) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export default getPool;