import React from 'react';
import { AuthStatus } from '../types';


export const checkAuthStatus = (): AuthStatus => {
  if (typeof window === 'undefined') {
    return {
      isLoggedIn: false,
      userName: '',
    };
  }

  const cookies = document.cookie.split(';');
  const userCookie = cookies.find(cookie => cookie.trim().startsWith('user_name='));
  
  if (userCookie) {
    const name = decodeURIComponent(userCookie.split('=')[1]);
    return {
      isLoggedIn: true,
      userName: name,
    };
  } else {
    return {
      isLoggedIn: false,
      userName: '',
    };
  }
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  
  // Clear cookies
  document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  document.cookie = 'user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  document.cookie = 'user_name=; max-age=0; path=/';
  document.cookie = 'user_email=; max-age=0; path=/';
  
  // Also clearing with domain
  const hostname = window.location.hostname;
  document.cookie = `user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
  document.cookie = `user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
  
  // Reload the page to reset the state
  window.location.reload();
};

export const useAuthStatus = () => {
  const [authStatus, setAuthStatus] = React.useState<AuthStatus>({
    isLoggedIn: false,
    userName: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const status = checkAuthStatus();
    setAuthStatus(status);
    setIsLoading(false);
  }, []);

  const refreshAuthStatus = () => {
    const status = checkAuthStatus();
    setAuthStatus(status);
  };

  React.useEffect(() => {
    const handleStorageChange = () => {
      refreshAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { ...authStatus, isLoading, refreshAuthStatus };
};
