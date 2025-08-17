import express from 'express'
import webPush from 'web-push'
import { cfg } from '../config/env.js'
import { query } from '../db/index.js'

const router = express.Router()
webPush.setVapidDetails('mailto:example@example.com', cfg().vapid.pub, cfg().vapid.priv)

router.post('/subscribe', async (req,res)=>{
  const sub = req.body
  if (!sub?.endpoint) return res.status(400).json({error:'bad subscription'})
  await query('INSERT INTO push_subscriptions(endpoint,p256dh,auth) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
    [sub.endpoint, sub.keys?.p256dh||'', sub.keys?.auth||''])
  res.json({ ok:true })
})

export async function sendPush(title, body, url) {
  const r = await query('SELECT * FROM push_subscriptions ORDER BY id DESC LIMIT 20')
  const subs = r.rows
  for (const s of subs) {
    try {
      await webPush.sendNotification({ endpoint: s.endpoint, keys:{ p256dh: s.p256dh, auth: s.auth } }, JSON.stringify({ title, body, url }))
    } catch(e) { /* ignore */ }
  }
}

export default router
