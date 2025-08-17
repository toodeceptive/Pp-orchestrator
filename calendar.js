import axios from 'axios'
import { googleToken } from './google.common.js'

export const calendar = {
  async list({ timeMin, timeMax, limit=20 }) {
    const at = await googleToken()
    const r = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers:{Authorization:`Bearer ${at}`}, params:{ maxResults:limit, singleEvents:true, orderBy:'startTime', timeMin, timeMax }
    })
    return r.data
  },
  async create({ summary='Event', startISO, endISO, description='' }) {
    const at = await googleToken()
    const body = { summary, description, start:{dateTime:startISO}, end:{dateTime:endISO} }
    const r = await axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', body, { headers:{Authorization:`Bearer ${at}`,'Content-Type':'application/json'} })
    return r.data
  }
}
