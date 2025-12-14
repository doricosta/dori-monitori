import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
    email?: string;
    token: string;
}

interface AuthContextType {
    authenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth', { email, password });
            const token = response.data.dados.token.token;

            localStorage.setItem('token', token);
            setUser({ email, token });
            return true;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.response?.data?.mensagem || 'Erro ao logar');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
