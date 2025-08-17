import express from 'express'
import { q } from '../queue/index.js'
const router = express.Router()

router.post('/gmail', async (req,res)=>{
  await q.enqueue('webhook', { provider:'gmail', body: req.body })
  res.json({ ok:true })
})
router.post('/drive', async (req,res)=>{
  await q.enqueue('webhook', { provider:'drive', body: req.body })
  res.json({ ok:true })
})
router.post('/github', async (req,res)=>{
  await q.enqueue('webhook', { provider:'github', body: req.body })
  res.json({ ok:true })
})

export default router
