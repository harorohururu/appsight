import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading] = useState(false);

  // Simple local login for admin and staff
  const login = async (email, password) => {
    if (email === 'admin' && password === 'admin123') {
      setUser({ email: 'admin', name: 'Admin', role: 'admin' });
      return { success: true };
    } else if (email === 'staff' && password === 'staff123') {
      setUser({ email: 'staff', name: 'Staff', role: 'staff' });
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
