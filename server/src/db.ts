import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

// 打包后 db 文件与 index.js 同目录；开发时放到 src 同级的 data 目录避免污染源码
const isProd = process.env.NODE_ENV === 'production';
const dbDir = isProd ? __dirname : path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'vaccines.db');
export const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS vaccines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dose INTEGER NOT NULL,
    scheduled_time TEXT NOT NULL,
    price REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_vaccines_time ON vaccines(scheduled_time);
`);

export interface VaccineRow {
  id: number;
  name: string;
  dose: number;
  scheduled_time: string;
  price: number;
  created_at: string;
  updated_at: string;
}
