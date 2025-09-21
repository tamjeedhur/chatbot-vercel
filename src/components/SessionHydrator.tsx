'use client';

import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSession } from '@/redux/slices/sessionSlice';
import { syncWithSession } from '@/redux/slices/authSlice';
import { CustomSession } from '@/types/interfaces';

export function SessionHydrator({ 
  session 
}: { 
  session: CustomSession | null;
}) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // Hydrate Redux store with session data on mount
    if (session) {
      dispatch(setSession(session));

      // Also sync auth slice with session tokens
      if (session.accessToken || session.refreshToken) {
        dispatch(
          syncWithSession({
            accessToken: session.accessToken || null,
            refreshToken: session.refreshToken || null,
          })
        );
      }
    }
  }, [session, dispatch]);

  // This component doesn't render anything
  return null;
}