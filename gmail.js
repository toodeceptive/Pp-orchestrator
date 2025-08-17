import axios from 'axios'
import { googleToken } from './google.common.js'
import { Buffer } from 'buffer'

function b64url(str) { return Buffer.from(str).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'') }

export const gmail = {
  async search({ q='', limit=10 }) {
    const at = await googleToken()
    const r = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', { headers:{Authorization:`Bearer ${at}`}, params:{ q, maxResults:limit } })
    return r.data
  },
  async send({ to, subject='(no subject)', text='' }) {
    const at = await googleToken()
    const raw = `To: ${to}\r\nSubject: ${subject}\r\n\r\n${text}`
    const r = await axios.post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { raw: b64url(raw) }, { headers:{Authorization:`Bearer ${at}`,'Content-Type':'application/json'} })
    return r.data
  }
}
