import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  loginCount: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (stored in localStorage)
const MOCK_ADMIN = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@bookstore.com',
  password: 'admin123',
  isAdmin: true,
  loginCount: 0
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Initialize mock users if not exists
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([MOCK_ADMIN]));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    
    // Update login count
    foundUser.loginCount += 1;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create user object (without password)
    const userData: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
      loginCount: foundUser.loginCount
    };
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password,
      isAdmin: false,
      loginCount: 1
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create user object (without password)
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      loginCount: 1
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
