import fs from 'fs'
import path from 'path'
import url from 'url'
import { query } from './index.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const dir = path.resolve(__dirname, './migrations')
const files = fs.readdirSync(dir).sort()
for (const f of files) {
  const sql = fs.readFileSync(path.join(dir,f),'utf-8')
  // naive: split on ;
  const stmts = sql.split(/;\s*\n/).map(s=>s.trim()).filter(Boolean)
  for (const s of stmts) { await query(s) }
  console.log('Applied', f)
}
process.exit(0)
