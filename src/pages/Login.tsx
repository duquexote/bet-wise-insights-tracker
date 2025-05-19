
import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast: legacyToast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Se já estiver autenticado, redireciona para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !phone) {
      legacyToast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(email, phone);
      
      if (success) {
        toast("Login realizado com sucesso", {
          description: "Você será redirecionado para o dashboard."
        });
        navigate("/dashboard");
      } else {
        legacyToast({
          title: "Erro de autenticação",
          description: "Email ou telefone inválidos.",
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
      const demoEmail = "demo@example.com";
      const demoPhone = "11999999999";
      
      setEmail(demoEmail);
      setPhone(demoPhone);
      
      const success = await login(demoEmail, demoPhone);
      
      if (success) {
        toast("Login de demonstração realizado", {
          description: "Bem-vindo à demonstração do BetTracker!"
        });
        navigate("/dashboard");
      } else {
        legacyToast({
          title: "Erro no login de demonstração",
          description: "Não foi possível realizar o login de demonstração.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-betBlue rounded-md mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">BT</span>
          </div>
          <CardTitle className="text-2xl font-bold">BetTracker</CardTitle>
        </CardHeader>
        <CardContent>
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
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="(99) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              Não possui uma conta?{" "}
              <Link to="/register" className="text-betBlue hover:underline">
                Registre-se
              </Link>
            </span>
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs text-gray-600">
            <p><strong>Demonstração:</strong> Email: demo@example.com | Telefone: 11999999999</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
