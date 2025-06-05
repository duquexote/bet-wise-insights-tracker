
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart, FileText, PieChart, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/betilha.svg" alt="Betilha Logo" className="h-10 w-auto" />
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-betBlue hover:bg-blue-700">Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-betBlue to-blue-700 text-white py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Gerencie suas apostas esportivas com inteligência
              </h2>
              <p className="text-xl opacity-90">
                Betilha é a plataforma perfeita para visualizar, analisar e acompanhar o desempenho de suas apostas esportivas.
              </p>
              <div className="flex space-x-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-betBlue hover:bg-gray-100">
                    Começar agora
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-800">
                    Já tenho uma conta
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                <div className="bg-white/80 rounded-md p-4 mb-4">
                  <div className="h-40 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="flex space-x-3">
                  <div className="bg-white/80 rounded-md p-3 flex-1">
                    <div className="h-20 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                  <div className="bg-white/80 rounded-md p-3 flex-1">
                    <div className="h-20 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos principais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-betBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard completo</h3>
              <p className="text-gray-600">Visualize o saldo atual, lucro/prejuízo total, ROI e muito mais em um painel intuitivo.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-betBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise avançada</h3>
              <p className="text-gray-600">Explore gráficos detalhados sobre a evolução da sua banca e performance por mercados.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-betBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de apostas</h3>
              <p className="text-gray-600">Mantenha registro de todas as suas apostas e visualize seu desempenho detalhado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Integration */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-6">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">INTEGRAÇÃO</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Integração com WhatsApp</h2>
              <p className="text-gray-600 mb-6">
                Suas apostas registradas pelo assistente de IA no WhatsApp são sincronizadas automaticamente com a Betilha, proporcionando uma experiência perfeita.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Sincronização em tempo real de apostas</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Simplificação do registro de apostas</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Histórico completo de todas as interações</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-100 p-6 rounded-lg max-w-sm">
                <div className="bg-white rounded-lg shadow-md p-4 mb-3 ml-auto max-w-[80%]">
                  <p className="text-sm">Como foi sua aposta de ontem?</p>
                  <p className="text-[10px] text-gray-500 text-right">10:30</p>
                </div>
                <div className="bg-green-100 rounded-lg shadow-md p-4 mb-3 max-w-[80%]">
                  <p className="text-sm">Registrei Flamengo vs Corinthians, odd 1.85, R$ 100, vitória!</p>
                  <p className="text-[10px] text-gray-500 text-right">10:31</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 max-w-[80%] ml-auto">
                  <p className="text-sm">Ótimo! Lucro de R$ 85. Atualizado na Betilha.</p>
                  <p className="text-[10px] text-gray-500 text-right">10:32</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-betBlue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para melhorar sua gestão de apostas?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a Betilha hoje e comece a tomar decisões mais informadas nas suas apostas.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-betBlue hover:bg-gray-100">
              Começar gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <img src="/betilha.svg" alt="Betilha Logo" className="h-14 w-auto" />
              </div>
              <p className="text-sm max-w-xs">
                Sua ferramenta completa para gestão e análise de apostas esportivas.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Produto</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Recursos</a></li>
                  <li><a href="#" className="hover:text-white">Planos</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Suporte</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Ajuda</a></li>
                  <li><a href="#" className="hover:text-white">Contato</a></li>
                  <li><a href="#" className="hover:text-white">Tutoriais</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Termos</a></li>
                  <li><a href="#" className="hover:text-white">Privacidade</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Betilha. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
