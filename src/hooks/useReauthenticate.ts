import { useCallback } from 'react';

import { authActions, useAuthDispatch } from 'src/AuthProvider';
import { showToast } from 'src/utils';

function useReauthenticate() {
  const authDispatch = useAuthDispatch();

  const reauthenticate = useCallback(
    <T>(fn: (...args: any[]) => Promise<T>) => async (...args: any[]) => {
      try {
        return await fn(...args);
      } catch (err) {
        if (err.status === 401) {
          try {
            // re authenticate and then retry
            await authActions.reAuthenticate();
            return await fn(...args);
          } catch (_err) {
            showToast('登入信息過期', {
              position: -160,
              shadow: false,
            });
            await authActions.logout(authDispatch);
          }
        }

        throw err;
      }
    },
    [authDispatch],
  );

  return reauthenticate;
}

export default useReauthenticate;
