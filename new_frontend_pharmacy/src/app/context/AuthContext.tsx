import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { clearStoredToken, getCurrentUser, getStoredToken, loginApi, setStoredToken } from '../lib/api';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser(storedToken);
        setCurrentUser(user);
        setToken(storedToken);
      } catch {
        clearStoredToken();
        setCurrentUser(null);
        setToken(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const auth = await loginApi(email, password);
      setStoredToken(auth.accessToken);
      const user = await getCurrentUser(auth.accessToken);

      setToken(auth.accessToken);
      setCurrentUser(user);
      return true;
    } catch {
      setCurrentUser(null);
      setToken(null);
      clearStoredToken();
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    clearStoredToken();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isAuthLoading,
      }}
    >
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
