import React, { createContext, useContext, useState, useEffect } from "react";
import supabaseService, { User } from "@/services/supabaseService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (email: string, phone: string) => Promise<boolean>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
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


const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está armazenado no localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  // Configurar real-time para atualizações do usuário
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    if (user) {
      // Inscrever-se para atualizações em tempo real do usuário
      unsubscribe = supabaseService.subscribeToUserChanges(user.id, (updatedUser) => {
        console.log('Usuário atualizado via real-time:', updatedUser);
        console.log('Banca inicial antes da atualização:', user.banca_inicial);
        console.log('Banca inicial recebida na atualização:', updatedUser.banca_inicial);
        
        // Preservar a banca inicial se ela vier undefined ou null na atualização
        if (updatedUser.banca_inicial === undefined || updatedUser.banca_inicial === null) {
          console.log('Preservando banca inicial anterior:', user.banca_inicial);
          updatedUser.banca_inicial = user.banca_inicial || 100000;
        }
        
        // Preservar a meta mensal se ela vier undefined ou null na atualização
        if (updatedUser.meta_mensal === undefined || updatedUser.meta_mensal === null) {
          console.log('Preservando meta mensal anterior:', user.meta_mensal);
          updatedUser.meta_mensal = user.meta_mensal || 1000;
        }
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      });
    }
    
    // Limpar a inscrição quando o componente for desmontado ou o usuário mudar
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id]); // Dependência no ID do usuário para recriar a inscrição se o usuário mudar

  // Login com email e senha (novo método principal)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("[Auth] Tentativa de login com email e senha:", { email });
      
      // Tentativa de login com o Supabase usando email e senha
      const userData = await supabaseService.loginWithPassword(email, password);
      
      if (!userData) {
        console.log("[Auth] Login falhou: Credenciais inválidas");
        return false;
      }
      
      // Login bem-sucedido
      console.log("[Auth] Login bem-sucedido, usuário:", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("[Auth] Erro de login:", error);
      return false;
    }
  };
  
  // Método de login legado com telefone (para compatibilidade)
  const loginWithPhone = async (email: string, phone: string): Promise<boolean> => {
    try {
      console.log("[Auth] Tentativa de login com telefone:", { email, phone });
      
      // Tentativa de login com o Supabase usando email e telefone
      const userData = await supabaseService.login(email, phone);
      
      if (!userData) {
        console.log("[Auth] Login falhou: Credenciais inválidas");
        return false;
      }
      
      // Login bem-sucedido
      console.log("[Auth] Login bem-sucedido, usuário:", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("[Auth] Erro de login:", error);
      return false;
    }
  };
  
  // Método para alteração de senha usando o sistema nativo do Supabase
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!user) {
        console.error("[Auth] Tentativa de alterar senha sem usuário autenticado");
        return false;
      }
      
      console.log("[Auth] Tentativa de alterar senha para usuário:", user.email);
      
      // Chamar o serviço para alterar a senha usando o sistema nativo do Supabase
      const success = await supabaseService.changePassword(currentPassword, newPassword);
      
      if (success) {
        console.log("[Auth] Senha alterada com sucesso");
        return true;
      } else {
        console.log("[Auth] Falha ao alterar senha");
        return false;
      }
    } catch (error) {
      console.error("[Auth] Erro ao alterar senha:", error);
      return false;
    }
  };
  
  // Método para registrar um novo usuário
  const register = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      console.log("[Auth] Tentativa de registro de novo usuário:", email);
      
      const newUser = await supabaseService.registerUser(email, password, userData);
      
      if (newUser) {
        console.log("[Auth] Usuário registrado com sucesso:", newUser);
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return true;
      } else {
        console.log("[Auth] Falha ao registrar usuário");
        return false;
      }
    } catch (error) {
      console.error("[Auth] Erro ao registrar usuário:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("Desconectando usuário");
    setUser(null);
    localStorage.removeItem("user");
  };

  const authContextValue = {
    user,
    login,
    loginWithPhone,
    register,
    logout,
    changePassword,
    isAuthenticated: !!user,
    isLoading
  };

  console.log("Estado atual do contexto de autenticação:", {
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
