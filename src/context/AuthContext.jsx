import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in on mount
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await authApi.me();
                setUser(data);
            } catch (error) {
                console.error('Auth verification failed', error);
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    };

    const login = async (email, password, type) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await authApi.login(email, password, type);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
