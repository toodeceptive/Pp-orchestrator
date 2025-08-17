import { query } from './db/index.js'
import { drive } from '../api/adapters/drive.js'
import { gmail } from '../api/adapters/gmail.js'
import { calendar } from '../api/adapters/calendar.js'

export async function execute({ run_id }) {
  const r = await query('SELECT * FROM runs WHERE id=$1', [run_id])
  if (!r.rowCount) return { ok:false, error:'run not found' }
  const run = r.rows[0]
  const plan = run.plan || {}

  // Very simple executor based on intent
  if (plan.intent === 'connector-action') {
    // Example: move PDFs from Gmail to Drive then create calendar events
    await query('INSERT INTO audits(run_id, stage, data) VALUES ($1,$2,$3)', [run_id, 'exec-start', {plan}])
    // (No-op): real flows would parse plan for concrete parameters/targets
    return { ok:true }
  }
  if (plan.intent === 'research') {
    await query('INSERT INTO audits(run_id, stage, data) VALUES ($1,$2,$3)', [run_id, 'research', {note:'stub'}])
    return { ok:true }
  }
  if (plan.intent === 'financial-action') {
    // Dry-run only
    await query('INSERT INTO audits(run_id, stage, data) VALUES ($1,$2,$3)', [run_id, 'dry-run', {note:'financial actions disabled by default'}])
    return { ok:true }
  }
  await query('INSERT INTO audits(run_id, stage, data) VALUES ($1,$2,$3)', [run_id, 'noop', {}])
  return { ok:true }
}
