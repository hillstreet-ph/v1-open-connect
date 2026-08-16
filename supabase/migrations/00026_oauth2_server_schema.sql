
-- ─────────────────────────────────────────────
-- OAuth 2.0 Server Schema
-- ─────────────────────────────────────────────

-- OAuth client applications (registered by users)
CREATE TABLE public.oauth_clients (
  id              bigserial PRIMARY KEY,
  owner_id        uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text NOT NULL DEFAULT '',
  logo_url        text,
  client_id       text NOT NULL UNIQUE DEFAULT 'oc_' || replace(gen_random_uuid()::text, '-', ''),
  client_secret   text NOT NULL DEFAULT 'ocs_' || replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  redirect_uris   text[] NOT NULL DEFAULT '{}',
  allowed_scopes  text[] NOT NULL DEFAULT ARRAY['openid','profile','resources:read'],
  grant_types     text[] NOT NULL DEFAULT ARRAY['authorization_code','refresh_token'],
  is_active       boolean NOT NULL DEFAULT true,
  is_public       boolean NOT NULL DEFAULT false,
  website_url     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.oauth_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own oauth_clients"    ON oauth_clients FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Users insert own oauth_clients"  ON oauth_clients FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users update own oauth_clients"  ON oauth_clients FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users delete own oauth_clients"  ON oauth_clients FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Admin full oauth_clients"        ON oauth_clients FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin'::user_role);
CREATE POLICY "Anon no oauth_clients"           ON oauth_clients FOR SELECT TO anon USING (false);

-- Authorization codes (short-lived, 10 min TTL)
CREATE TABLE public.oauth_codes (
  id              bigserial PRIMARY KEY,
  code            text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  client_id       text NOT NULL REFERENCES oauth_clients(client_id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  redirect_uri    text NOT NULL,
  scopes          text[] NOT NULL DEFAULT '{}',
  code_challenge  text,
  challenge_method text,
  is_used         boolean NOT NULL DEFAULT false,
  expires_at      timestamptz NOT NULL DEFAULT now() + interval '10 minutes',
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.oauth_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only oauth_codes" ON oauth_codes FOR ALL USING (false);

-- Access + refresh tokens
CREATE TABLE public.oauth_tokens (
  id              bigserial PRIMARY KEY,
  access_token    text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  refresh_token   text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  token_type      text NOT NULL DEFAULT 'Bearer',
  client_id       text NOT NULL REFERENCES oauth_clients(client_id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scopes          text[] NOT NULL DEFAULT '{}',
  is_revoked      boolean NOT NULL DEFAULT false,
  access_expires_at  timestamptz NOT NULL DEFAULT now() + interval '1 hour',
  refresh_expires_at timestamptz NOT NULL DEFAULT now() + interval '30 days',
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only oauth_tokens" ON oauth_tokens FOR ALL USING (false);

-- Consent records (remember user approvals)
CREATE TABLE public.oauth_consents (
  id         bigserial PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id  text NOT NULL REFERENCES oauth_clients(client_id) ON DELETE CASCADE,
  scopes     text[] NOT NULL DEFAULT '{}',
  granted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_id)
);

ALTER TABLE public.oauth_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only oauth_consents" ON oauth_consents FOR ALL USING (false);

-- Indexes
CREATE INDEX idx_oauth_codes_code     ON oauth_codes(code);
CREATE INDEX idx_oauth_codes_expires  ON oauth_codes(expires_at);
CREATE INDEX idx_oauth_tokens_access  ON oauth_tokens(access_token);
CREATE INDEX idx_oauth_tokens_refresh ON oauth_tokens(refresh_token);
CREATE INDEX idx_oauth_tokens_user    ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_clients_cid    ON oauth_clients(client_id);

-- Auto-cleanup expired codes/tokens (run via pg_cron if available)
CREATE OR REPLACE FUNCTION cleanup_expired_oauth()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM oauth_codes  WHERE expires_at < now() OR is_used = true AND created_at < now() - interval '1 hour';
  DELETE FROM oauth_tokens WHERE access_expires_at < now() AND (refresh_token IS NULL OR refresh_expires_at < now());
END;
$$;

-- Helper: verify access token and return user_id + scopes
CREATE OR REPLACE FUNCTION verify_oauth_token(p_token text)
RETURNS TABLE(user_id uuid, scopes text[], client_id text)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
    SELECT t.user_id, t.scopes, t.client_id
    FROM oauth_tokens t
    WHERE t.access_token = p_token
      AND t.is_revoked = false
      AND t.access_expires_at > now();
END;
$$;
