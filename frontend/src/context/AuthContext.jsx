import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import apiClient, { getCsrfCookie, setUnauthorizedHandler } from '../lib/apiClient';
import { queryClient } from '../lib/queryClient';

const AuthContext = createContext(null);

function extractErrorMessage(error, fallback = 'Something went wrong.') {
  const data = error?.response?.data;
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors).flat()[0];
    if (typeof first === 'string') return first;
  }
  return fallback;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearClientAuth = useCallback(() => {
    flushSync(() => {
      setUser(null);
    });
    queryClient.clear();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearClientAuth();
      navigate('/auth', { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [clearClientAuth, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        await getCsrfCookie();
        const { data } = await apiClient.get('/auth/me');
        if (cancelled) return;
        const nextUser = data?.data ?? null;
        setUser(nextUser);
      } catch {
        if (cancelled) return;
        clearClientAuth();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [clearClientAuth]);

  const login = useCallback(async (email, password) => {
    await getCsrfCookie();
    const { data } = await apiClient.post('/auth/login', { email, password });
    const nextUser = data?.data?.user ?? null;

    setUser(nextUser);
    return { user: nextUser };
  }, []);

  const register = useCallback(async (payload) => {
    await getCsrfCookie();
    const { data } = await apiClient.post('/auth/register', payload);
    const nextUser = data?.data?.user ?? null;
    setUser(nextUser);
    return { user: nextUser };
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user) {
        await apiClient.post('/auth/logout');
      }
    } catch {
      // Still clear local session even if the API call fails.
    } finally {
      clearClientAuth();
      navigate('/auth', { replace: true });
    }
  }, [clearClientAuth, navigate, user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      register,
      updateCurrentUser: (nextUser) => {
        setUser(nextUser);
      },
      extractErrorMessage,
    }),
    [user, isLoading, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return ctx;
}

export default AuthContext;
