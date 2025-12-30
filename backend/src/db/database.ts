import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'chat.db');
const SCHEMA_PATH = path.join(process.cwd(), 'src', 'db', 'schema.sql');

export const db = new Database(DB_PATH);

export const initializeDatabase = () => {
	const schema = readFileSync(SCHEMA_PATH, 'utf-8');
	db.exec(schema);
};
