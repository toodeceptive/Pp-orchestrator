import axios from 'axios'
import { googleToken } from './google.common.js'

export const drive = {
  async search({ q="name contains ' '", limit=20 }) {
    const at = await googleToken()
    const r = await axios.get('https://www.googleapis.com/drive/v3/files', {
      headers:{Authorization:`Bearer ${at}`}, params:{ q, pageSize:limit, fields:'files(id,name,mimeType,modifiedTime,parents)' }
    })
    return r.data
  },
  async read({ fileId }) {
    const at = await googleToken()
    const r = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}`, { headers:{Authorization:`Bearer ${at}`}, params:{alt:'media'} })
    return typeof r.data === 'string' ? r.data : JSON.stringify(r.data)
  }
}
