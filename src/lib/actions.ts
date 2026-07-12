'use server';

import { cookies } from 'next/headers';
import { ADMIN_EMAIL, ADMIN_PASSWORD, encryptSession } from './auth';
import { db } from './db';

export async function authenticateAdmin(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { success: false, error: 'Please fill in all security parameters.' };
  }

  // Strict structural authentication match checks
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    // Write dynamic unauthorized audit trail to database
    await db.activityLog.create({
      data: {
        action: `Failed authentication attempt. Email tried: ${email}`,
      }
    }).catch(() => {});

    return { success: false, error: 'Invalid security parameters.' };
  }

  // Create JWT session
  const token = await encryptSession({ email, role: 'administrator' });

  // Commit session to client's browser cookies using secure flags
  cookies().set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 120, // 2 Hour session limit
    path: '/',
  });

  // Log Successful Audit
  await db.activityLog.create({
    data: {
      action: 'Administrator successfully authorized session.',
    }
  }).catch(() => {});

  return { success: true, error: null };
}
