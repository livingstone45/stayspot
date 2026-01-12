import React, { useState, useContext, createContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    }
    
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);
  
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    setIsAuthenticated,
  };
  
  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

export default useAuth;
