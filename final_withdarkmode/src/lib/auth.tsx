import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { getCurrentUser, login as dbLogin, logout as dbLogout, register as dbRegister } from './db';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string, role: 'user' | 'host') => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    const loggedInUser = dbLogin(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    role: 'user' | 'host'
  ): Promise<User | null> => {
    const newUser = dbRegister(username, email, password, role);
    setUser(newUser);
    return newUser;
  };

  const logout = async (): Promise<void> => {
    dbLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export function withAuth<T>(Component: React.ComponentType<T>, requiredRole?: 'user' | 'host') {
  return function WithAuth(props: T & JSX.IntrinsicAttributes) {
    const { user, loading } = useAuth();
    const navigate = (path: string) => {
      window.location.href = path;
    };

    useEffect(() => {
      if (!loading && !user) {
        navigate('/login');
      } else if (!loading && requiredRole && user?.role !== requiredRole) {
        navigate('/');
      }
    }, [user, loading]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    if (requiredRole && user.role !== requiredRole) {
      return null;
    }

    return <Component {...props} />;
  };
}