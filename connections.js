import { query } from '../db/index.js'
export async function get(provider) {
  const r = await query('SELECT * FROM connections WHERE provider=$1 ORDER BY id DESC LIMIT 1', [provider])
  return r.rows[0]
}
export async function set(provider, tok, meta={}) {
  const expires_at = tok.expires_in ? new Date(Date.now() + (tok.expires_in*1000)) : null
  await query('INSERT INTO connections(provider, access_token, refresh_token, expires_at, meta) VALUES ($1,$2,$3,$4,$5)',
    [provider, tok.access_token, tok.refresh_token || null, expires_at, meta])
  return true
}
