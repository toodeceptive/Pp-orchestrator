import express from 'express'
import axios from 'axios'
import { cfg } from '../config/env.js'
import { set as setConn } from '../adapters/connections.js'

const router = express.Router()

// Google
router.get('/google/start', (req,res)=>{
  const base = cfg().base
  const id = cfg().google.client_id
  if (!base || !id) return res.status(400).send('Missing PUBLIC_BASE_URL or GOOGLE_CLIENT_ID')
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', id)
  url.searchParams.set('redirect_uri', `${base}/oauth/google/callback`)
  url.searchParams.set('response_type','code')
  url.searchParams.set('access_type','offline')
  url.searchParams.set('scope', [
    'openid','email','profile',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar'
  ].join(' '))
  res.redirect(url.toString())
})
router.get('/google/callback', async (req,res)=>{
  const code = req.query.code
  try {
    const r = await axios.post('https://oauth2.googleapis.com/token', {
      code, client_id: cfg().google.client_id, client_secret: cfg().google.client_secret,
      redirect_uri: `${cfg().base}/oauth/google/callback`, grant_type:'authorization_code'
    }, { headers:{'Content-Type':'application/json'}})
    await setConn('google', {...r.data, created_at: new Date().toISOString()})
    res.send('<h1>Google connected</h1>')
  } catch(e) {
    res.status(500).send('Google OAuth error: ' + String(e?.response?.data || e))
  }
})

// GitHub
router.get('/github/start', (req,res)=>{
  const base = cfg().base
  const id = cfg().github.client_id
  if (!base || !id) return res.status(400).send('Missing PUBLIC_BASE_URL or GITHUB_CLIENT_ID')
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', id)
  url.searchParams.set('redirect_uri', `${base}/oauth/github/callback`)
  url.searchParams.set('scope','repo read:user user:email')
  res.redirect(url.toString())
})
router.get('/github/callback', async (req,res)=>{
  const code = req.query.code
  try {
    const r = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: cfg().github.client_id, client_secret: cfg().github.client_secret,
      code, redirect_uri: `${cfg().base}/oauth/github/callback`
    }, { headers:{'Accept':'application/json'}})
    await setConn('github', r.data)
    res.send('<h1>GitHub connected</h1>')
  } catch(e) {
    res.status(500).send('GitHub OAuth error: ' + String(e?.response?.data || e))
  }
})

export default router
