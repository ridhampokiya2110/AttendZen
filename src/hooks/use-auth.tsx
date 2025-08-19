
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// This is a mock user type. In a real app, this would be more complex.
interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

// This is a mock auth provider. In a real app, you would integrate
// with Firebase Auth or another authentication service.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    if (isBrowser) {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        } finally {
            setLoading(false);
        }
    }
  }, []);

  const login = async (email: string, password?: string) => {
    // Mock login logic
    setLoading(true);
    // In a real app, you'd call your auth API here.
    // We'll just simulate a successful login.
    const mockUser: User = { email };
    if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(mockUser));
    }
    setUser(mockUser);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    if (isBrowser) {
        localStorage.removeItem('user');
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
