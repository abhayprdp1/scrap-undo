'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  phone: string;
  city: 'Kochi' | 'Palakkad' | 'Malappuram' | 'Thrissur';
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string, name?: string, city?: string) => void;
  signup: (name: string, phone: string, city: 'Kochi' | 'Palakkad' | 'Malappuram' | 'Thrissur', address?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted session
    const savedToken = localStorage.getItem('scrapundo_token');
    const savedUser = localStorage.getItem('scrapundo_user');
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setToken(savedToken);
      } catch (e) {
        console.error('Failed to parse auth state', e);
      }
    } else {
      // Default demo profile for Abhay P in Kerala
      const defaultUser: User = {
        id: 'usr-abhay-1',
        name: 'Abhay P',
        phone: '+91 94470 54321',
        city: 'Kochi',
        address: 'Edappally Toll, Kochi, Kerala 682024',
      };
      setUser(defaultUser);
      setToken('demo-kerala-token');
      localStorage.setItem('scrapundo_user', JSON.stringify(defaultUser));
      localStorage.setItem('scrapundo_token', 'demo-kerala-token');
    }
  }, []);

  const login = (phone: string, name?: string, city?: string) => {
    const loggedUser: User = {
      id: 'usr-' + Date.now(),
      name: name || user?.name || 'Abhay P',
      phone,
      city: (city as any) || user?.city || 'Kochi',
      address: user?.address || 'Kochi, Kerala',
    };
    setUser(loggedUser);
    setToken('token-' + Date.now());
    localStorage.setItem('scrapundo_token', 'token-' + Date.now());
    localStorage.setItem('scrapundo_user', JSON.stringify(loggedUser));
  };

  const signup = (name: string, phone: string, city: 'Kochi' | 'Palakkad' | 'Malappuram' | 'Thrissur', address?: string) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      phone,
      city,
      address: address || `${city}, Kerala`,
    };
    setUser(newUser);
    setToken('token-' + Date.now());
    localStorage.setItem('scrapundo_token', 'token-' + Date.now());
    localStorage.setItem('scrapundo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('scrapundo_token');
    localStorage.removeItem('scrapundo_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
