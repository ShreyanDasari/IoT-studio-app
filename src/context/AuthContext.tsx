import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string, sessionTime: number) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (emailOrUsername: string, password: string, sessionTime: number) => {
    try {
      const response = await apiLogin(emailOrUsername, password, sessionTime);
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};