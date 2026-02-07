import { defineMiddleware } from 'astro:middleware';

const PASSWORD = 'PatelFamily';
const COOKIE_NAME = 'claudia_auth';
const COOKIE_VALUE = 'authenticated';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/login') {
    return next();
  }

  const cookie = context.cookies.get(COOKIE_NAME);
  if (cookie?.value === COOKIE_VALUE) {
    return next();
  }

  // Check for POST login attempt
  if (context.request.method === 'POST' && context.url.pathname === '/auth') {
    const form = await context.request.formData();
    const password = form.get('password');
    
    if (password === PASSWORD) {
      context.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return context.redirect('/');
    }
    
    return context.redirect('/login?error=1');
  }

  return context.redirect('/login');
});
