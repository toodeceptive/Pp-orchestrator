export function enforce(plan, policy) {
  const issues = []
  const cap = Math.max(10, Math.min(5000, policy.maxUSD || 300))
  if (plan?.sizing) {
    for (const s of [].concat(plan.sizing)) {
      if (Number(s.usd||0) > cap) issues.push(`sizing exceeds cap ${cap}`)
    }
  }
  if (policy.kill) issues.push('kill-switch active')
  return { ok: issues.length===0, issues, cap }
}
