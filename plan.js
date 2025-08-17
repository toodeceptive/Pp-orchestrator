import { cfg } from '../config/env.js'
import axios from 'axios'

export async function plan(task) {
  const intent = infer(task)
  if (!cfg().llm.key) {
    return { intent, summary:'deterministic plan', steps:['analyze','prepare','execute','verify','report'], sizing:[{usd: Math.min(cfg().policy.maxUSD, 300)}] }
  }
  const prompt = [
    { role:'system', content:'Return strictly valid JSON with fields: intent, summary, steps[], sizing[]. Keep it compact.'},
    { role:'user', content: task }
  ]
  const r = await axios.post(`${process.env.OPENAI_BASE_URL||'https://api.openai.com/v1'}/responses`, { model: cfg().llm.model, input: prompt }, { headers:{Authorization:`Bearer ${cfg().llm.key}`} })
  try { return JSON.parse(r.data.output_text) } catch { return { intent, summary: r.data.output_text } }
}
function infer(s) {
  const t = String(s).toLowerCase()
  if (/(trade|order|buy|sell|allocate|position)/.test(t)) return 'financial-action'
  if (/(research|analy[sz]e|summari[sz]e)/.test(t)) return 'research'
  if (/(drive|gmail|calendar|github|file|email|event)/.test(t)) return 'connector-action'
  return 'general'
}
