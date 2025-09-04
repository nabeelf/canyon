import React from 'react';
import { AuthStatus } from '../types';

export const checkAuthStatus = (): AuthStatus => {
  if (typeof window === 'undefined') {
    return {
      isLoggedIn: false,
      userName: '',
      userId: '',
      userEmail: '',
      userPicture: '',
      emailVerified: false,
    };
  }

  const cookies = document.cookie.split(';');
  const userCookie = cookies.find(cookie => cookie.trim().startsWith('user_name='));
  
  if (userCookie) {
    const name = decodeURIComponent(userCookie.split('=')[1]);
    const email = cookies.find(cookie => cookie.trim().startsWith('user_email='))?.split('=')[1] || '';
    const userId = cookies.find(cookie => cookie.trim().startsWith('user_id='))?.split('=')[1] || '';
    const picture = cookies.find(cookie => cookie.trim().startsWith('user_picture='))?.split('=')[1] || '';
    const emailVerified = cookies.find(cookie => cookie.trim().startsWith('email_verified='))?.split('=')[1] === 'true';
    
    return {
      isLoggedIn: true,
      userName: name,
      userId: userId,
      userEmail: email,
      userPicture: picture,
      emailVerified: emailVerified,
    };
  } else {
    return {
      isLoggedIn: false,
      userName: '',
      userId: '',
      userEmail: '',
      userPicture: '',
      emailVerified: false,
    };
  }
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  
  // Clear all OIDC cookies
  const cookiesToClear = ['user_name', 'user_email', 'user_id', 'user_picture', 'email_verified'];
  
  cookiesToClear.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `${cookieName}=; max-age=0; path=/`;
  });
  
  // Also clearing with domain
  const hostname = window.location.hostname;
  cookiesToClear.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
  });
  
  // Reload the page to reset the state
  window.location.reload();
};

export const useAuthStatus = () => {
  const [authStatus, setAuthStatus] = React.useState<AuthStatus>({
    isLoggedIn: false,
    userName: '',
    userId: '',
    userEmail: '',
    userPicture: '',
    emailVerified: false,
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
