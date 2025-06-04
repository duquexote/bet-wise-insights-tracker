
import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Removida a opção de método de autenticação, usando sempre senha
  const navigate = useNavigate();
  const { toast: legacyToast } = useToast();
  // Removida referência ao loginWithPhone que não é mais usado
  const { login, isAuthenticated } = useAuth();

  // Se já estiver autenticado, redireciona para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      legacyToast({
        title: "Erro de validação",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Usando apenas login com email e senha
      const success = await login(email, password);
      
      if (success) {
        toast("Login realizado com sucesso", {
          description: "Você será redirecionado para o dashboard."
        });
        navigate("/dashboard");
      } else {
        legacyToast({
          title: "Erro de autenticação",
          description: "Email ou senha inválidos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      legacyToast({
        title: "Erro",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const demoEmail = "leobonavides@cantosrace.com.br";
      const demoPassword = "557193616894"; // Usando o número de telefone como senha inicial
      
      setEmail(demoEmail);
      setPassword(demoPassword);
      // Não é mais necessário definir o método de autenticação
      
      const success = await login(demoEmail, demoPassword);
      
      if (success) {
        toast("Login realizado com sucesso", {
          description: "Bem-vindo ao Betilha!"
        });
        navigate("/dashboard");
      } else {
        legacyToast({
          title: "Erro no login",
          description: "Não foi possível realizar o login.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para registro de novo usuário (não implementada na interface ainda)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Esta função pode ser implementada em uma página de registro separada
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-betBlue rounded-md mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">BE</span>
          </div>
          <CardTitle className="text-2xl font-bold">Betilha</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Removida a navegação por abas, mantendo apenas login com email e senha */}
            
            {/* Login com email e senha */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-betBlue hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            {/* Removido o conteúdo da aba de telefone */}
          {/* Fim do conteúdo de login */}
          
          <div className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Entrar com conta de demonstração
            </Button>
          </div>
          
          {/* Removido o link de registro */}
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs text-gray-600">
            <p><strong>Exemplo:</strong> Email: leobonavides@cantosrace.com.br | Senha: 557193616894</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
