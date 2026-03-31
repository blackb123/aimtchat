import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const storedUsername = localStorage.getItem(STORAGE_KEYS.USER_NAME);

    if (storedToken && storedUserId && storedUsername) {
      setUser({
        id: Number(storedUserId),
        username: storedUsername,
        token: storedToken,
      });
      setToken(storedToken);
    }
  }, []);

  const login = (token: string, userId: string, username: string) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, username);
    
    setUser({
      id: Number(userId),
      username,
      token,
    });
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    
    setUser(null);
    setToken(null);
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
};
