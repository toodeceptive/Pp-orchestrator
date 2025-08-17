import pg from 'pg'
import { cfg } from '../config/env.js'
const { Pool } = pg
export const pool = new Pool({ connectionString: cfg().db.url, max: 5 })

export async function query(q, params=[]) { const r = await pool.query(q, params); return r }
