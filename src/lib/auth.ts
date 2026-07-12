import { SignJWT, jwtVerify } from 'jose';

// Fetch credentials securely from Server Environment Variables
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "anupadmin123***@gmail.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "anupji***@@@66";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'a-long-random-fallback-32-character-secret-key-for-jwt'
);

export async function encryptSession(payload: { email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET);
}

export async function decryptSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
