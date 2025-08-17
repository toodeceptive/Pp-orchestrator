-- 0001_init.sql
CREATE TABLE IF NOT EXISTS connections (
  id SERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  account_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runs (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  intent TEXT,
  plan JSONB,
  policy JSONB,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audits (
  id SERIAL PRIMARY KEY,
  run_id INTEGER REFERENCES runs(id) ON DELETE CASCADE,
  stage TEXT,
  data JSONB,
  ts TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'queued',
  attempts INTEGER DEFAULT 0,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  run_after TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS confirmations (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  run_id INTEGER REFERENCES runs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  used_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  endpoint TEXT,
  p256dh TEXT,
  auth TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
