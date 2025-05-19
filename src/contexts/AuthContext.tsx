
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  phone: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Usuário de exemplo para login rápido
const DEMO_USER = {
  email: "demo@example.com",
  phone: "11999999999"
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, phone: string): Promise<boolean> => {
    try {
      console.log("Login attempt with:", { email, phone });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Aceita login com credenciais de exemplo ou verifica as credenciais
      const isValidCredentials = 
        (email === DEMO_USER.email && phone === DEMO_USER.phone) ||
        (email && phone);  // Mantém a validação simples para qualquer email/telefone
      
      if (!isValidCredentials) {
        console.log("Login failed: Invalid credentials");
        return false;
      }
      
      // Login bem-sucedido
      const newUser = {
        id: "user123",
        email,
        phone
      };
      
      console.log("Login successful, setting user:", newUser);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("Logging out user");
    setUser(null);
    localStorage.removeItem("user");
  };

  const authContextValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  console.log("Auth context current state:", {
    isAuthenticated: !!user,
    isLoading,
    hasUser: !!user
  });

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
