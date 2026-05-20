'use client';

import { useEffect, useState, useCallback } from 'react';
import { storage } from '../utils/storage';

// ─────────────────────────────────────────────
// ✅ NO module-level authState global.
// Each browser tab reads its OWN localStorage independently,
// so two tabs logged in as different users never interfere.
// ─────────────────────────────────────────────

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id?.toString() || user._id?.toString() || '',
  };
};

// ─────────────────────────────────────────────
// 🔐 LOGIN
// ─────────────────────────────────────────────
export const login = async (email, password, mobileNumber, address, roomNumber) => {
  try {
    const res = await fetch('https://washmate-backend-dugg.vercel.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, mobileNumber, address, roomNumber }),
    });

    const data = await res.json();
    if (!res.ok || !data.token) return false;

    const user = normalizeUser(data.user);
    storage.setAuth({ user, token: data.token });
    return true;

  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
};

// ─────────────────────────────────────────────
// 📝 REGISTER
// ─────────────────────────────────────────────
export const register = async (email, password, name, mobileNumber, address, roomNumber) => {
  try {
    if (!email || !password || !name)
      return { success: false, message: 'All fields required' };

    const res = await fetch('https://washmate-backend-dugg.vercel.app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, mobileNumber, address, roomNumber }),
    });

    const data = await res.json();
    if (!res.ok || !data.token)
      return { success: false, message: data.message || 'Registration failed' };

    const user = normalizeUser(data.user);
    storage.setAuth({ user, token: data.token });
    return { success: true };

  } catch (err) {
    console.error('Register error:', err);
    return { success: false, message: 'Something went wrong' };
  }
};

// ─────────────────────────────────────────────
// 🚪 LOGOUT
// ─────────────────────────────────────────────
export const logout = () => {
  storage.clearAuth();
};

// ─────────────────────────────────────────────
// 🧹 CLEAR SESSION (used by login page on mount)
// ─────────────────────────────────────────────
export const clearSession = () => {
  storage.clearAuth();
};

// ─────────────────────────────────────────────
// 🧠 HOOK
// Each call reads from localStorage — isolated per tab.
// ─────────────────────────────────────────────
export function useAuth() {
  const getStateFromStorage = useCallback(() => {
    const savedAuth = storage.getAuth();
    if (savedAuth?.user && savedAuth?.token) {
      return {
        isAuthenticated: true,
        user: normalizeUser(savedAuth.user),
      };
    }
    return { isAuthenticated: false, user: null };
  }, []);

  const [state, setState] = useState(() => getStateFromStorage());

  useEffect(() => {
    // Sync state on mount in case localStorage was set before hydration
    setState(getStateFromStorage());

    // ✅ Listen for storage changes — handles logout in another tab
    const handleStorageChange = (e) => {
      if (e.key === 'washmate_auth') {
        setState(getStateFromStorage());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getStateFromStorage]);

  const handleLogin = useCallback(async (email, password, mobileNumber, address, roomNumber) => {
    const success = await login(email, password, mobileNumber, address, roomNumber);
    if (success) setState(getStateFromStorage());
    return success;
  }, [getStateFromStorage]);

  const handleRegister = useCallback(async (email, password, name, mobileNumber, address, roomNumber) => {
    const result = await register(email, password, name, mobileNumber, address, roomNumber);
    if (result?.success) setState(getStateFromStorage());
    return result;
  }, [getStateFromStorage]);

  const handleLogout = useCallback(() => {
    logout();
    setState({ isAuthenticated: false, user: null });
  }, []);

  return {
    ...state,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };
}
