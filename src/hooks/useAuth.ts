'use client';

import { useState, useEffect } from 'react';
import { checkAuthStatus, logout as apiLogout, type AuthStatus } from '@/lib/api';

export function useAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthStatus();
  }, []);

  useEffect(() => {
    console.log("authStatus ==> ", authStatus);
  }, [authStatus]);

  const loadAuthStatus = async () => {
    try {
      const status = await checkAuthStatus();
      setAuthStatus(status);
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      setAuthStatus({ logged_in: false });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setAuthStatus({ logged_in: false });
      // 로그아웃 후 홈으로 리다이렉트
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return {
    authStatus,
    loading,
    isLoggedIn: authStatus?.logged_in ?? false,
    user: authStatus?.logged_in
      ? {
          id: authStatus.user_id,
          email: authStatus.email,
          name: authStatus.name,
        }
      : null,
    logout,
    refresh: loadAuthStatus,
  };
}

