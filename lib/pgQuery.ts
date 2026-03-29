import pg from 'pg';
// import 'dotenv';

const { Pool } = pg;

let pool: any = null;

export const getPool = () => {
    if (!pool) {
        const connectionString = process.env.AI_SEO_DB_URL;
        if (!connectionString) {
            console.error('[DB] AI_SEO_DB_URL is not set');
            return null;
        }
        pool = new Pool({
            connectionString,
            ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });
        pool.on('error', (err: any) => {
            console.error('[DB] Unexpected pool error:', err.message);
        });
        console.log('[DB] Pool initialized');
    }
    return pool;
};

let migrationsRun = false;

export const query = async (text: string, params?: any) => {
    const p = getPool();
    if (!p) throw new Error('Database not configured');

    if (!migrationsRun) {
        migrationsRun = true; // Set early to prevent parallel executions
        try {
            // Ensure the 'status' columns exist on startup. 
            // If they already exist, this is a no-op.
            await p.query("ALTER TABLE clients ADD COLUMN IF NOT EXISTS status VARCHAR(50)");
            await p.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(50)");
            console.log('[DB] Status column migrations applied');
        } catch (err: any) {
            console.error('[DB] Status column migration error:', err.message);
        }
    }

    return p.query(text, params);
};
