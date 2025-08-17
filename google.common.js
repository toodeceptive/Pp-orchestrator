import axios from 'axios'
import { get as getConn, set as setConn } from './connections.js'
import { cfg } from '../config/env.js'

export async function googleToken() {
  const c = await getConn('google')
  if (!c) throw new Error('Google not connected')
  if (c.expires_at && new Date(c.expires_at) < new Date(Date.now()-60000) && c.refresh_token) {
    const r = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: cfg().google.client_id, client_secret: cfg().google.client_secret,
      grant_type:'refresh_token', refresh_token: c.refresh_token
    }, { headers:{'Content-Type':'application/json'}})
    await setConn('google', r.data)
    return r.data.access_token
  }
  return c.access_token
}
