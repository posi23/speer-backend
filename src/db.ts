import { Client, Pool } from "pg";
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const pool = new Client({ connectionString: process.env.DATABASE_URL, });
// process.env.NODE_ENV === 'test' ? new Client({
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT) || 5432,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// }) : 



let isConnected = false;


const connect = async () => {
    if (isConnected) {
        return;
    }

    try {
        await pool.connect();
        console.log("Connected to PostgreSQL");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Table users created");

        await pool.query(`CREATE TABLE IF NOT EXISTS notes(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                search_index TSVECTOR GENERATED ALWAYS AS (
                    to_tsvector('english', title || ' ' || content)
                ) STORED
            );
        `);
        console.log("Table notes created");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS shared_notes (
            id SERIAL PRIMARY KEY,
            note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
            shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Table shared_notes created");

        await pool.query(`CREATE INDEX IF NOT EXISTS idx_search_index ON notes USING GIN (search_index);`);
        console.log("Index idx_search_index created");

        isConnected = true;

    } catch (err) {
        if (err instanceof Error) {
            console.error("Connection error", err.stack);
        } else {
            console.error("Connection error", err);
        }
    }
}

export { pool, connect };