import React, { createContext, useContext, useState } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, name: string) => {
    setUser({
      uid: 'mock-uid-' + Math.random().toString(36).substr(2, 9),
      email,
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    // Simulate sending an account creation email
    console.log(`[MOCK EMAIL] To: ${email} | Subject: Welcome to OneKart! | Message: Hello ${name}, your account has been created successfully.`);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
