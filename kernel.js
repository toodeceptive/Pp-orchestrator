import { cfg } from '../config/env.js'
import { query } from '../db/index.js'
import { plan } from './plan.js'
import { enforce } from './policy.js'
import { q } from '../queue/index.js'
import { v4 as uuidv4 } from 'uuid'

export async function orchestrate({ task }) {
  const planObj = await plan(task)
  const policy = enforce(planObj, cfg().policy)
  const run = await query('INSERT INTO runs(task,intent,plan,policy,status) VALUES($1,$2,$3,$4,$5) RETURNING id',
    [task, planObj.intent, planObj, policy, 'planned'])
  const run_id = run.rows[0].id
  await query('INSERT INTO audits(run_id, stage, data) VALUES ($1,$2,$3)', [run_id, 'planned', planObj])

  const impactful = planObj.intent === 'financial-action'
  const require = cfg().policy.requireConfirm

  if (require && impactful || !policy.ok) {
    const token = uuidv4()
    await query('INSERT INTO confirmations(token, run_id) VALUES ($1,$2)', [token, run_id])
    await query('UPDATE runs SET status=$1 WHERE id=$2', ['need-confirmation', run_id])
    return { status:'NEED_CONFIRMATION', token, run_id, plan: planObj, policy }
  }

  await q.enqueue('execute', { run_id })
  await query('UPDATE runs SET status=$1 WHERE id=$2', ['queued', run_id])
  return { status:'QUEUED', run_id, plan: planObj }
}
