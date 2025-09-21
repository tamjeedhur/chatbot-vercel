'use server';

import { cookies } from 'next/headers';

export type Theme = 'light' | 'dark';

export async function getTheme(): Promise<Theme> {
  try {
    const cookieStore = cookies();
    const theme = cookieStore.get('theme')?.value as Theme;
    return theme || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
}

export async function setTheme(theme: Theme) {
  try {
    const cookieStore = cookies();
    
    // Set cookie with secure options
    cookieStore.set('theme', theme, {
      httpOnly: false, // Allow client-side access for instant feedback
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  } catch (error) {
    console.error('Error setting theme:', error);
  }
}

export async function toggleTheme() {
  try {
    const currentTheme = await getTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
    return newTheme;
  } catch (error) {
    console.error('Error toggling theme:', error);
    return 'light';
  }
}