-- Local auth: users, refresh_sessions, oauth_accounts, otp_codes, audit_log.
-- Uses the existing admin_users table as the source of truth for CMS logins;
-- these tables add production-grade session refresh, OAuth links, and OTP.

CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'content_admin'
    CHECK (role IN ('super_admin','content_admin','exam_admin','user')),
  email_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Opaque refresh tokens, hashed at rest. One row per issued refresh token.
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  user_agent text,
  ip inet,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- OAuth 2.0 account links (Google, GitHub, ...). One user can have many.
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_user_id text NOT NULL,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  scopes text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_user_id)
);

-- One-time password codes for email/OTP login. SHA-256 hashed at rest.
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid REFERENCES auth_users(id) ON DELETE CASCADE,
  email text NOT NULL,
  code_hash text NOT NULL,
  purpose text NOT NULL DEFAULT 'login'
    CHECK (purpose IN ('login','email_verify','password_reset')),
  consumed_at timestamptz,
  attempts smallint NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  detail jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- State/nonce table for OAuth flows (PKCE-style).
CREATE TABLE IF NOT EXISTS oauth_states (
  state text PRIMARY KEY,
  provider text NOT NULL,
  code_verifier text,
  return_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id, created_at DESC);

ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

-- These tables are accessed exclusively server-side via the service role
-- (DATABASE_URL). No public/anon access; deny by default.

-- Seed a bootstrap admin into auth_users (bcrypt hash of "ChangeMe@123").
-- Override via /api/auth/setup or by updating the row directly.
INSERT INTO auth_users (email, password_hash, name, role, email_verified)
VALUES (
  'admin@nationalcollege.edu.in',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Administrator',
  'super_admin',
  true
)
ON CONFLICT (email) DO NOTHING;
