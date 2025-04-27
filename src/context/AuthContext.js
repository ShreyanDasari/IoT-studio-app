import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/api';
const AuthContext = createContext({
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
});
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);
    const login = async (emailOrUsername, password, sessionTime) => {
        try {
            const response = await apiLogin(emailOrUsername, password, sessionTime);
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
                setIsAuthenticated(true);
            }
            else {
                throw new Error('Invalid login response');
            }
        }
        catch (error) {
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
            throw error;
        }
    };
    const logout = async () => {
        try {
            await apiLogout();
        }
        finally {
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
        }
    };
    return (_jsx(AuthContext.Provider, { value: { isAuthenticated, login, logout }, children: children }));
};
