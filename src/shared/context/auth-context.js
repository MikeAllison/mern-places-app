import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  authToken: null,
  login: () => {},
  logout: () => {}
});
