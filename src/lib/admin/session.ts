import crypto from 'crypto';

const DEFAULT_COOKIE_NAME = 'admin_session';
const DEFAULT_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h

type AdminSessionPayload = {
  token: string;
  exp: number; // unix seconds
  username: string;
};

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in environment variables.`);
  }
  return value;
}

export function getAdminSessionCookieName() {
  return process.env.ADMIN_SESSION_COOKIE_NAME || DEFAULT_COOKIE_NAME;
}

export function createAdminSessionCookieValue(username: string) {
  const secret = getEnvOrThrow('ADMIN_SESSION_SECRET');
  const maxAgeSeconds =
    Number(process.env.ADMIN_SESSION_MAX_AGE_SECONDS) ||
    DEFAULT_SESSION_MAX_AGE_SECONDS;

  const token = crypto.randomBytes(32).toString('hex');
  const payload: AdminSessionPayload = {
    token,
    username,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadJson, 'utf8').toString('base64url');

  const sig = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${sig}`;
}

export function verifyAdminSessionCookieValue(cookieValue: string) {
  const secret = getEnvOrThrow('ADMIN_SESSION_SECRET');

  const [payloadB64, sig] = cookieValue.split('.');
  if (!payloadB64 || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  if (
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
  ) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson) as AdminSessionPayload;

    if (!payload?.exp || typeof payload.exp !== 'number') return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.username) return null;

    return {
      username: payload.username,
      token: payload.token,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

