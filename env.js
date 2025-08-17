export function cfg() {
  const env = (k, d='') => process.env[k] ?? d
  return {
    base: env('PUBLIC_BASE_URL',''),
    db: { url: env('DATABASE_URL','') },
    redis: { url: env('REDIS_URL','') },
    vapid: { pub: env('VAPID_PUBLIC_KEY',''), priv: env('VAPID_PRIVATE_KEY','') },
    llm: { key: env('OPENAI_API_KEY',''), model: env('OPENAI_MODEL','gpt-4o-mini') },
    policy: {
      requireConfirm: (env('REQUIRE_CONFIRMATIONS','true').toLowerCase() !== 'false'),
      kill: (env('KILL_SWITCH','false').toLowerCase() === 'true'),
      maxUSD: Number(env('MAX_ORDER_USD') || 300),
      allow: (env('ASSET_WHITELIST')||'').split(',').map(s=>s.trim()).filter(Boolean),
      deny: (env('ASSET_BLACKLIST')||'').split(',').map(s=>s.trim()).filter(Boolean),
    },
    google: {
      client_id: env('GOOGLE_CLIENT_ID',''),
      client_secret: env('GOOGLE_CLIENT_SECRET','')
    },
    github: {
      client_id: env('GITHUB_CLIENT_ID',''),
      client_secret: env('GITHUB_CLIENT_SECRET','')
    }
  }
}
