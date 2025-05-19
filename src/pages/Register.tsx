
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !phone || !confirmPhone) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (phone !== confirmPhone) {
      toast({
        title: "Erro de validação",
        description: "Os telefones não coincidem.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registro realizado com sucesso",
        description: "Você pode fazer login agora.",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
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
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
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
              <p className="text-xs text-gray-500">
                O número de telefone será usado como sua senha
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPhone" className="text-sm font-medium">
                Confirmar Telefone
              </label>
              <Input
                id="confirmPhone"
                type="tel"
                placeholder="(99) 99999-9999"
                value={confirmPhone}
                onChange={(e) => setConfirmPhone(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-betBlue hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Cadastrar"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              Já possui uma conta?{" "}
              <Link to="/login" className="text-betBlue hover:underline">
                Entrar
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
