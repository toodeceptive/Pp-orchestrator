import axios from 'axios'
import { get as getConn } from './connections.js'

async function ghToken() {
  const c = await getConn('github')
  if (!c?.access_token) throw new Error('GitHub not connected')
  return c.access_token
}

export const github = {
  async searchIssues({ repo, q='is:issue is:open', limit=20 }) {
    const t = await ghToken()
    const r = await axios.get('https://api.github.com/search/issues', { headers:{Authorization:`Bearer ${t}`,'Accept':'application/vnd.github+json'}, params:{ q:`repo:${repo} ${q}`, per_page:limit } })
    return r.data
  }
}
