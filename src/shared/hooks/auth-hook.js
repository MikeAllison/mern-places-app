import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [authToken, setauthToken] = useState(null);

  const login = useCallback((userId, authToken, tokenExpiration) => {
    setUserId(userId);
    const expirationDate =
      tokenExpiration || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpiration);
    localStorage.setItem(
      'authData',
      JSON.stringify({
        userId: userId,
        token: authToken,
        expiration: expirationDate.toISOString()
      })
    );
    setauthToken(authToken);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setTokenExpirationDate(null);
    setauthToken(null);
    localStorage.removeItem('authData');
  }, []);

  useEffect(() => {
    if (authToken && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [authToken, logout, tokenExpirationDate]);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (
      authData &&
      authData.token &&
      new Date(authData.expiration) > new Date()
    ) {
      login(authData.userId, authData.token, new Date(authData.expiration));
    }
  }, [login]);

  return { userId, authToken, login, logout };
};
