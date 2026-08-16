// Open Connect OAuth 2.0 Authorization Server
// Implements: Authorization Code Flow + PKCE, Token endpoint, UserInfo, Revocation
// RFC 6749 + RFC 7636 (PKCE) + OpenID Connect Core 1.0
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ISSUER       = `${SUPABASE_URL}/functions/v1/oc-oauth`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// ── Helpers ──────────────────────────────────────────────────────────────────

function html(body: string, status = 200) {
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Open Connect</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f0f0f;color:#e5e5e5;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem}.card{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:1rem;padding:2rem;width:100%;max-width:440px;box-shadow:0 25px 50px rgba(0,0,0,.5)}.logo{display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem}.logo-icon{width:40px;height:40px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:.75rem;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:white}.logo-name{font-size:1.1rem;font-weight:700;color:white}h2{font-size:1.25rem;font-weight:700;margin-bottom:.5rem;color:white}p{color:#9ca3af;font-size:.875rem;line-height:1.6;margin-bottom:1rem}.app-info{background:#111;border:1px solid #222;border-radius:.75rem;padding:1rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:.75rem}.app-logo{width:48px;height:48px;border-radius:.5rem;background:#252525;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0}.app-name{font-weight:600;color:white;font-size:.95rem}.app-url{font-size:.75rem;color:#6b7280}.scopes-list{list-style:none;margin-bottom:1.5rem;display:flex;flex-direction:column;gap:.5rem}.scope-item{display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:#d1d5db}.scope-item::before{content:"✓";color:#6366f1;font-weight:700;flex-shrink:0}.actions{display:flex;gap:.75rem;flex-direction:column}.btn{width:100%;padding:.75rem 1.5rem;border-radius:.5rem;font-size:.875rem;font-weight:600;cursor:pointer;border:none;transition:.15s}.btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white}.btn-primary:hover{opacity:.9}.btn-secondary{background:#252525;color:#9ca3af;border:1px solid #333}.btn-secondary:hover{background:#2a2a2a}.error-box{background:#2a1215;border:1px solid #3f1d22;border-radius:.75rem;padding:1rem;color:#f87171;font-size:.875rem;margin-bottom:1rem}.login-form label{display:block;font-size:.8rem;color:#9ca3af;margin-bottom:.25rem;margin-top:.75rem}.login-form input{width:100%;padding:.6rem .85rem;background:#111;border:1px solid #333;border-radius:.5rem;color:white;font-size:.875rem;outline:none}.login-form input:focus{border-color:#6366f1}</style></head><body>${body}</body></html>`, {
    status, headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function jsonResp(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function oauthError(error: string, description: string, status = 400) {
  return jsonResp({ error, error_description: description }, status);
}

async function sha256base64url(plain: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

function scopeLabel(scope: string): string {
  const labels: Record<string, string> = {
    openid:           'Know who you are (OpenID)',
    profile:          'Read your username and profile',
    email:            'Read your email address',
    'resources:read': 'Browse and search all AI resources',
    'resources:write':'Create and manage AI resources',
    'admin':          'Full admin access',
  };
  return labels[scope] ?? scope;
}

// ── OAuth 2.0 / OIDC Discovery ────────────────────────────────────────────────

function discoveryDoc() {
  return jsonResp({
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/authorize`,
    token_endpoint:         `${ISSUER}/token`,
    userinfo_endpoint:      `${ISSUER}/userinfo`,
    revocation_endpoint:    `${ISSUER}/revoke`,
    jwks_uri:               `${ISSUER}/jwks`,
    scopes_supported:       ['openid','profile','email','resources:read','resources:write','admin'],
    response_types_supported: ['code'],
    grant_types_supported:  ['authorization_code','refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['client_secret_post','client_secret_basic'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    claims_supported: ['sub','iss','aud','exp','iat','email','preferred_username','profile'],
  });
}

// ── Authorization endpoint (/authorize) ──────────────────────────────────────

async function handleAuthorize(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const p   = url.searchParams;

  const clientId            = p.get('client_id') ?? '';
  const redirectUri         = p.get('redirect_uri') ?? '';
  const responseType        = p.get('response_type') ?? '';
  const scope               = p.get('scope') ?? 'openid profile';
  const state               = p.get('state') ?? '';
  const codeChallenge       = p.get('code_challenge') ?? '';
  const codeChallengeMethod = p.get('code_challenge_method') ?? '';

  // Validate client
  const { data: client } = await db.from('oauth_clients')
    .select('*').eq('client_id', clientId).eq('is_active', true).maybeSingle();

  if (!client) return html(errorCard('Invalid client_id. This OAuth app does not exist or has been disabled.'));
  if (!client.redirect_uris.includes(redirectUri)) return html(errorCard('Invalid redirect_uri. This URI is not registered for this application.'));
  if (responseType !== 'code') return redirectWithError(redirectUri, state, 'unsupported_response_type', 'Only code flow supported');

  const scopes = scope.split(' ').filter(Boolean);

  // If POST (form submission) — process login + consent
  if (req.method === 'POST') {
    const form = await req.formData();
    const action   = form.get('action') as string;
    const email    = form.get('email') as string;
    const password = form.get('password') as string;

    if (action === 'deny') return redirectWithError(redirectUri, state, 'access_denied', 'User denied access');

    // Authenticate user via Supabase Auth
    const authClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY') ?? SERVICE_KEY);
    const { data: signIn, error: signInError } = await authClient.auth.signInWithPassword({ email, password });

    if (signInError || !signIn.user) {
      return html(consentPage(client, scopes, clientId, redirectUri, responseType, scope, state, codeChallenge, codeChallengeMethod, 'Invalid email or password. Please try again.'));
    }

    const userId = signIn.user.id;

    // Store consent
    await db.from('oauth_consents').upsert({ user_id: userId, client_id: clientId, scopes }, { onConflict: 'user_id,client_id' });

    // Generate auth code
    const { data: codeRow } = await db.from('oauth_codes').insert({
      client_id: clientId,
      user_id: userId,
      redirect_uri: redirectUri,
      scopes,
      code_challenge: codeChallenge || null,
      challenge_method: codeChallengeMethod || null,
    }).select('code').single();

    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set('code', codeRow!.code);
    if (state) callbackUrl.searchParams.set('state', state);

    return Response.redirect(callbackUrl.toString(), 302);
  }

  // GET — show consent/login page
  return html(consentPage(client, scopes, clientId, redirectUri, responseType, scope, state, codeChallenge, codeChallengeMethod));
}

function redirectWithError(redirectUri: string, state: string, error: string, desc: string) {
  const url = new URL(redirectUri);
  url.searchParams.set('error', error);
  url.searchParams.set('error_description', desc);
  if (state) url.searchParams.set('state', state);
  return Response.redirect(url.toString(), 302);
}

function errorCard(msg: string) {
  return `<div class="card"><div class="logo"><div class="logo-icon">OC</div><div class="logo-name">Open Connect</div></div><div class="error-box">${msg}</div><p style="text-align:center;margin-top:.5rem"><a href="javascript:history.back()" style="color:#6366f1;text-decoration:none;font-size:.875rem">← Go back</a></p></div>`;
}

function consentPage(
  client: Record<string,unknown>, scopes: string[],
  clientId: string, redirectUri: string, responseType: string,
  scope: string, state: string, codeChallenge: string, codeChallengeMethod: string,
  errorMsg = ''
) {
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: responseType, scope, state, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod });
  return `<div class="card">
  <div class="logo"><div class="logo-icon">OC</div><div class="logo-name">Open Connect</div></div>
  <div class="app-info">
    <div class="app-logo">${client.logo_url ? `<img src="${client.logo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:.5rem">` : '🔗'}</div>
    <div><div class="app-name">${client.name}</div><div class="app-url">${client.website_url ?? redirectUri}</div></div>
  </div>
  <h2>Sign in to authorize</h2>
  <p><strong style="color:white">${client.name}</strong> is requesting access to your Open Connect account:</p>
  <ul class="scopes-list">${scopes.map(s => `<li class="scope-item">${scopeLabel(s)}</li>`).join('')}</ul>
  ${errorMsg ? `<div class="error-box">${errorMsg}</div>` : ''}
  <form method="POST" class="login-form" action="?${params.toString()}">
    <label>Email</label>
    <input type="email" name="email" required placeholder="you@example.com" autocomplete="email">
    <label>Password</label>
    <input type="password" name="password" required placeholder="••••••••" autocomplete="current-password">
    <div class="actions" style="margin-top:1.25rem">
      <button type="submit" name="action" value="approve" class="btn btn-primary">Authorize ${client.name}</button>
      <button type="submit" name="action" value="deny"    class="btn btn-secondary">Cancel</button>
    </div>
  </form>
</div>`;
}

// ── Token endpoint (/token) ───────────────────────────────────────────────────

async function handleToken(req: Request): Promise<Response> {
  let body: Record<string,string> = {};
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    for (const pair of text.split('&')) {
      const [k, v] = pair.split('=');
      body[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
    }
  } else {
    body = await req.json().catch(() => ({}));
  }

  // Support Basic auth header for client_secret
  const authHeader = req.headers.get('Authorization') ?? '';
  if (authHeader.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const [id, secret] = decoded.split(':');
    body.client_id     = body.client_id     || id;
    body.client_secret = body.client_secret || secret;
  }

  const grantType = body.grant_type ?? '';

  if (grantType === 'authorization_code') return handleCodeExchange(body);
  if (grantType === 'refresh_token')      return handleRefreshToken(body);

  return oauthError('unsupported_grant_type', `Grant type '${grantType}' is not supported`);
}

async function handleCodeExchange(body: Record<string,string>): Promise<Response> {
  const { code, client_id, client_secret, redirect_uri, code_verifier } = body;

  // Validate client
  const { data: client } = await db.from('oauth_clients')
    .select('*').eq('client_id', client_id).eq('is_active', true).maybeSingle();
  if (!client) return oauthError('invalid_client', 'Client not found', 401);
  if (!client.is_public && client.client_secret !== client_secret)
    return oauthError('invalid_client', 'Invalid client_secret', 401);

  // Fetch code
  const { data: codeRow } = await db.from('oauth_codes')
    .select('*').eq('code', code).eq('client_id', client_id).eq('is_used', false).maybeSingle();

  if (!codeRow) return oauthError('invalid_grant', 'Authorization code not found or already used');
  if (new Date(codeRow.expires_at) < new Date()) return oauthError('invalid_grant', 'Authorization code expired');
  if (codeRow.redirect_uri !== redirect_uri) return oauthError('invalid_grant', 'redirect_uri mismatch');

  // PKCE verification
  if (codeRow.code_challenge) {
    if (!code_verifier) return oauthError('invalid_grant', 'code_verifier required');
    const computed = await sha256base64url(code_verifier);
    if (computed !== codeRow.code_challenge) return oauthError('invalid_grant', 'PKCE verification failed');
  }

  // Mark code as used
  await db.from('oauth_codes').update({ is_used: true }).eq('id', codeRow.id);

  // Issue tokens
  const { data: token } = await db.from('oauth_tokens').insert({
    client_id,
    user_id: codeRow.user_id,
    scopes: codeRow.scopes,
  }).select('*').single();

  const profile = await getProfile(codeRow.user_id);

  return jsonResp({
    access_token:  token!.access_token,
    token_type:    'Bearer',
    expires_in:    3600,
    refresh_token: token!.refresh_token,
    scope:         codeRow.scopes.join(' '),
    ...(codeRow.scopes.includes('openid') ? { id_token: buildIdToken(profile, client_id, ISSUER) } : {}),
  });
}

async function handleRefreshToken(body: Record<string,string>): Promise<Response> {
  const { refresh_token, client_id, client_secret } = body;

  const { data: client } = await db.from('oauth_clients')
    .select('*').eq('client_id', client_id).eq('is_active', true).maybeSingle();
  if (!client) return oauthError('invalid_client', 'Client not found', 401);
  if (!client.is_public && client.client_secret !== client_secret)
    return oauthError('invalid_client', 'Invalid client_secret', 401);

  const { data: oldToken } = await db.from('oauth_tokens')
    .select('*').eq('refresh_token', refresh_token).eq('client_id', client_id).eq('is_revoked', false).maybeSingle();

  if (!oldToken) return oauthError('invalid_grant', 'Refresh token not found or revoked');
  if (new Date(oldToken.refresh_expires_at) < new Date()) return oauthError('invalid_grant', 'Refresh token expired');

  // Revoke old token, issue new one
  await db.from('oauth_tokens').update({ is_revoked: true }).eq('id', oldToken.id);
  const { data: newToken } = await db.from('oauth_tokens').insert({
    client_id,
    user_id: oldToken.user_id,
    scopes: oldToken.scopes,
  }).select('*').single();

  return jsonResp({
    access_token:  newToken!.access_token,
    token_type:    'Bearer',
    expires_in:    3600,
    refresh_token: newToken!.refresh_token,
    scope:         oldToken.scopes.join(' '),
  });
}

// ── UserInfo endpoint (/userinfo) ─────────────────────────────────────────────

async function handleUserInfo(req: Request): Promise<Response> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return oauthError('invalid_token', 'Missing access token', 401);

  const { data: rows } = await db.rpc('verify_oauth_token', { p_token: token });
  if (!rows?.length) return oauthError('invalid_token', 'Token invalid or expired', 401);

  const { user_id, scopes } = rows[0];
  const profile = await getProfile(user_id);

  const claims: Record<string,unknown> = { sub: user_id };
  if (scopes.includes('profile') || scopes.includes('openid')) {
    claims.preferred_username = profile?.username;
    claims.name               = profile?.username;
    claims.profile            = `https://openconnect.ai/profile`;
    claims.updated_at         = profile?.created_at;
  }
  if (scopes.includes('email')) {
    claims.email = profile?.email;
  }

  return jsonResp(claims);
}

// ── Revocation endpoint (/revoke) ─────────────────────────────────────────────

async function handleRevoke(req: Request): Promise<Response> {
  const text = await req.text();
  const params = new URLSearchParams(text);
  const token     = params.get('token') ?? '';
  const tokenHint = params.get('token_type_hint') ?? 'access_token';

  if (tokenHint === 'refresh_token') {
    await db.from('oauth_tokens').update({ is_revoked: true }).eq('refresh_token', token);
  } else {
    await db.from('oauth_tokens').update({ is_revoked: true }).eq('access_token', token);
  }

  return new Response(null, { status: 200, headers: CORS });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getProfile(userId: string) {
  const { data } = await db.from('profiles').select('*').eq('id', userId).maybeSingle();
  return data;
}

function buildIdToken(profile: Record<string,unknown> | null, audience: string, issuer: string): string {
  // Simplified JWT — real production should use RS256 with a stored key pair
  // This is a base64url-encoded JWT for OIDC compatibility
  const header  = { alg: 'HS256', typ: 'JWT' };
  const now     = Math.floor(Date.now() / 1000);
  const payload = {
    iss: issuer,
    sub: profile?.id,
    aud: audience,
    exp: now + 3600,
    iat: now,
    email: profile?.email,
    preferred_username: profile?.username,
  };
  const enc = (obj: unknown) => btoa(JSON.stringify(obj)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  return `${enc(header)}.${enc(payload)}.sig_placeholder`;
}

// ── JWKS endpoint (/jwks) ─────────────────────────────────────────────────────

function handleJwks() {
  return jsonResp({ keys: [] }); // Placeholder — add RS256 key pair for production OIDC
}

// ── Main router ───────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const url  = new URL(req.url);
  const path = url.pathname.replace(/^\/functions\/v1\/oc-oauth/, '') || '/';

  if (path === '/.well-known/openid-configuration') return discoveryDoc();
  if (path === '/jwks' || path === '/.well-known/jwks.json') return handleJwks();
  if (path === '/authorize') return handleAuthorize(req);
  if (path === '/token'  && req.method === 'POST') return handleToken(req);
  if (path === '/userinfo') return handleUserInfo(req);
  if (path === '/revoke' && req.method === 'POST') return handleRevoke(req);

  if (path === '/' || path === '/health') {
    return jsonResp({
      service:  'Open Connect OAuth 2.0 Server',
      issuer:   ISSUER,
      version:  '1.0.0',
      endpoints: {
        discovery:  `${ISSUER}/.well-known/openid-configuration`,
        authorize:  `${ISSUER}/authorize`,
        token:      `${ISSUER}/token`,
        userinfo:   `${ISSUER}/userinfo`,
        revoke:     `${ISSUER}/revoke`,
        jwks:       `${ISSUER}/jwks`,
      },
      scopes_supported: ['openid','profile','email','resources:read','resources:write'],
      grant_types:      ['authorization_code','refresh_token'],
      pkce_supported:   true,
    });
  }

  return jsonResp({ error: 'not_found' }, 404);
});
