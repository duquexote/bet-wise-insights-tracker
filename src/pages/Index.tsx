
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart, FileText, PieChart, TrendingUp, Check, Bot, MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
            <a href="/login">
              <Button variant="outline">Entrar</Button>
            </a>
            <a href="#planos">
              <Button className="bg-betBlue hover:bg-blue-700">Conhecer Planos</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-betBlue to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Transforme suas apostas em estratégia com o poder da IA + dados em tempo real
              </h2>
              <p className="text-xl opacity-90">
                Controle sua banca, registre suas apostas com um clique no WhatsApp e otimize seus lucros com estatísticas profissionais.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="#planos">
                  <Button size="lg" className="bg-white text-betBlue hover:bg-gray-100 w-full sm:w-auto">
                    Assine e Comece Agora
                  </Button>
                </Link>
                <Badge className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 text-sm">
                  Planos a partir de R$ 50/mês
                </Badge>
              </div>
              <Link to="/login" className="text-white hover:underline inline-block mt-2">
                Já sou assinante
              </Link>
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

      {/* O Problema section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Está perdendo dinheiro por não controlar suas apostas?</h2>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Apostadores de todos os níveis cometem o mesmo erro: <span className="font-bold">não têm gestão de banca e não analisam seu desempenho</span>. Isso leva a perdas desnecessárias e a um ciclo vicioso de apostas mal planejadas.
          </p>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl w-full">
              {/* Mini Dashboard Header */}
              <div className="flex items-center px-4 py-2 border-b">
                <img src="/betilha.svg" alt="Betilha Logo" className="h-8 w-auto mr-2" />
                <div className="text-gray-400 text-sm ml-auto">06/06/2025</div>
              </div>
              
              {/* Mini Dashboard Content */}
              <div className="p-2">
                {/* First row of cards */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {/* Saldo Card */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Saldo</p>
                      <div className="bg-blue-50 p-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                    <p className="font-bold text-lg mt-1">R$ 13.774,95</p>
                  </div>
                  
                  {/* % Lucro Card */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">% Lucro sobre Banca</p>
                      <div className="bg-blue-50 p-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                    <p className="font-bold text-lg mt-1">38.75%</p>
                  </div>
                  
                  {/* Lucro/Prejuízo Card */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Lucro/Prejuízo</p>
                      <div className="bg-blue-50 p-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                    <p className="font-bold text-lg mt-1">R$ 3.874,95</p>
                  </div>
                </div>
                
                {/* Second row of cards */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {/* Total de Apostas Card */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Total de Apostas</p>
                      <div className="bg-blue-50 p-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                    <p className="font-bold text-lg mt-1">4</p>
                  </div>
                  
                  {/* ROI Card */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">ROI</p>
                      <div className="bg-blue-50 p-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                    <p className="font-bold text-lg mt-1">55.21%</p>
                  </div>
                  
                  {/* Taxa de Vitórias Card */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Taxa de Vitórias</p>
                      <div className="bg-blue-50 p-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                    <p className="font-bold text-lg mt-1">75.00%</p>
                  </div>
                </div>
                
                {/* Charts row */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Evolução da Banca Chart */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <h3 className="text-sm font-medium mb-2">Evolução da Banca</h3>
                    <div className="relative h-36">
                      {/* Simplified line chart */}
                      <div className="absolute inset-0 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                          <path 
                            d="M0,35 C10,30 20,25 30,28 C40,31 50,30 60,32 C70,34 80,25 90,15 L90,50 L0,50 Z" 
                            fill="rgba(59, 130, 246, 0.1)" 
                          />
                          <path 
                            d="M0,35 C10,30 20,25 30,28 C40,31 50,30 60,32 C70,34 80,25 90,15" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="1" 
                          />
                        </svg>
                      </div>
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400">
                        <span>R$4000</span>
                        <span>R$3000</span>
                        <span>R$2000</span>
                        <span>R$1000</span>
                        <span>R$0</span>
                      </div>
                      {/* X-axis labels */}
                      <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-gray-400">
                        <span>1/5</span>
                        <span>20/5</span>
                        <span>20/5</span>
                        <span>20/5</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Distribuição de Resultados Chart */}
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <h3 className="text-sm font-medium mb-2">Distribuição de Resultados</h3>
                    <div className="flex justify-center items-center h-36">
                      {/* Simplified pie chart */}
                      <div className="relative w-24 h-24">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke="#22c55e" 
                            strokeWidth="18" 
                            strokeDasharray="75, 100" 
                          />
                          <path 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="18" 
                            strokeDasharray="25, 100" 
                            strokeDashoffset="-75" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Apostas Recentes */}
                <div className="bg-white p-3 rounded-md border border-gray-100">
                  <h3 className="text-sm font-medium mb-2">Apostas Recentes</h3>
                  <div className="space-y-2">
                    {/* Aposta 1 - Green */}
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">Bahia — Paysandu</p>
                          <p className="text-xs text-green-500 font-medium">Ganho</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">Escanteios Totais • Odd 1.51</p>
                          <p className="text-xs text-green-500">+R$ 1020,00</p>
                        </div>
                        <p className="text-[10px] text-gray-400">20/05/25</p>
                      </div>
                    </div>
                    
                    {/* Aposta 2 - Red */}
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">Bahia — Paysandu, Corinthians — Novorizontino SP</p>
                          <p className="text-xs text-red-500 font-medium">Perda</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">Dupla • Odd 16.75</p>
                          <p className="text-xs text-red-500">-R$ 100,00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como a Betilha resolve section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">A Betilha entrega para você:</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="h-12 w-12 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
                <Bot className="h-6 w-6 text-betBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">IA integrada</h3>
              <p className="text-gray-600">IA para gestão de banca automática e assistência 24h no WhatsApp para registro instantâneo de apostas.</p>
              <div className="mt-4">
                <Badge className="bg-blue-100 text-blue-800">Exclusivo</Badge>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="h-12 w-12 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-betBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard profissional</h3>
              <p className="text-gray-600">ROI, taxa de acerto, lucro/prejuízo e gráficos detalhados por mercado e período.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="h-12 w-12 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-betBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Evolução em tempo real</h3>
              <p className="text-gray-600">Acompanhe sua banca em tempo real e identifique o que realmente dá lucro com filtros avançados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* IA no WhatsApp Integration */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-6">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">EXCLUSIVO</Badge>
              </div>
              <h2 className="text-3xl font-bold mb-4">Seu gerente de banca pessoal no WhatsApp</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Com a IA da Betilha, você registra apostas, acompanha o saldo e verifica suas metas sem precisar abrir a plataforma.
                Basta um comando simples no WhatsApp e seu saldo é atualizado automaticamente, com total integração.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">Registro de aposta via IA</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">Atualização automática da banca</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">Acompanhamento das metas mensais</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">Assistente 24h na palma da mão</p>
                </div>
              </div>
              <div className="mt-8">
                <a href="#planos">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Quero ter essa IA agora
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Betilha IA</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 mb-3 ml-auto max-w-[80%] border border-gray-100">
                  <p className="text-sm">Como foi sua aposta de ontem?</p>
                  <p className="text-[10px] text-gray-500 text-right">10:30</p>
                </div>
                <div className="bg-green-50 rounded-lg shadow-sm p-4 mb-3 max-w-[80%] border border-green-100">
                  <p className="text-sm">Registrei Flamengo vs Corinthians, odd 1.85, R$ 100, green!</p>
                  <p className="text-[10px] text-gray-500 text-right">10:31</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 max-w-[80%] ml-auto border border-gray-100">
                  <p className="text-sm">Ótimo! Lucro de R$ 85. Saldo atualizado: R$ 1.285,00</p>
                  <p className="text-[10px] text-gray-500 text-right">10:32</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section id="planos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Escolha o seu plano e comece hoje mesmo:</h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Plano Mensal */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mensal</h3>
                <div className="text-3xl font-bold mb-1">R$ 49,90<span className="text-sm font-normal text-gray-500">/mês</span></div>
                <p className="text-gray-500 text-sm mb-6">Cobrado mensalmente</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Acesso completo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">IA integrada</span>
                  </li>
                </ul>
                
                <Link to="https://pay.cakto.com.br/9vi55f9" className="block">
                  <Button className="w-full bg-betBlue hover:bg-blue-700">Assinar</Button>
                </Link>
              </div>
            </div>
            
            {/* Plano Trimestral */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Trimestral</h3>
                <div className="text-3xl font-bold mb-1">R$ 119,70<span className="text-sm font-normal text-gray-500">/3 meses</span></div>
                <p className="text-gray-500 text-sm mb-6">R$ 39,90/mês</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Acesso completo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">IA integrada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Economia de 20%</span>
                  </li>
                </ul>
                
                <Link to="https://pay.cakto.com.br/wbsxgq5" className="block">
                  <Button className="w-full bg-betBlue hover:bg-blue-700">Assinar</Button>
                </Link>
              </div>
            </div>
            
            {/* Plano Semestral */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Semestral</h3>
                <div className="text-3xl font-bold mb-1">R$ 239,40<span className="text-sm font-normal text-gray-500">/6 meses</span></div>
                <p className="text-gray-500 text-sm mb-6">R$ 39,90/mês</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Acesso completo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">IA integrada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Economia de 20%</span>
                  </li>
                </ul>
                
                <Link to="https://pay.cakto.com.br/3khphcj" className="block">
                  <Button className="w-full bg-betBlue hover:bg-blue-700">Assinar</Button>
                </Link>
              </div>
            </div>
            
            {/* Plano Anual - Destaque */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-betBlue overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-betBlue text-white text-xs font-bold py-1 px-3 rounded-bl">
                MELHOR OFERTA
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Anual</h3>
                <div className="text-3xl font-bold mb-1">R$ 419,00<span className="text-sm font-normal text-gray-500">/ano</span></div>
                <p className="text-gray-500 text-sm mb-6">R$ 34,91/mês</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Acesso completo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">IA integrada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Economia de 30%</span>
                  </li>
                </ul>
                
                <Link to="https://pay.cakto.com.br/t4ugoa7" className="block">
                  <Button className="w-full bg-betBlue hover:bg-blue-700">Assinar</Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 italic">Não há plano gratuito. Invista na sua gestão de banca e leve suas apostas para outro nível.</p>
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Compare e veja a diferença</h2>
          
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left font-semibold border">Recursos</th>
                  <th className="p-4 text-center font-semibold border">Planilha</th>
                  <th className="p-4 text-center font-semibold border bg-blue-50">Betilha + IA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border">Registro de apostas</td>
                  <td className="p-4 text-center border">Manual</td>
                  <td className="p-4 text-center border bg-blue-50 font-medium">Instantâneo (WhatsApp + Web)</td>
                </tr>
                <tr>
                  <td className="p-4 border">Controle da banca</td>
                  <td className="p-4 text-center border">Manual</td>
                  <td className="p-4 text-center border bg-blue-50 font-medium">Automático e em tempo real</td>
                </tr>
                <tr>
                  <td className="p-4 border">IA assistente no WhatsApp</td>
                  <td className="p-4 text-center border"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center border bg-blue-50 font-medium"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border">Gráficos e análises</td>
                  <td className="p-4 text-center border">Limitado</td>
                  <td className="p-4 text-center border bg-blue-50 font-medium">Avançado e personalizável</td>
                </tr>
                <tr>
                  <td className="p-4 border">Relatórios</td>
                  <td className="p-4 text-center border">Limitado</td>
                  <td className="p-4 text-center border bg-blue-50 font-medium">Profissionais + Exportação</td>
                </tr>
                <tr>
                  <td className="p-4 border">Experiência</td>
                  <td className="p-4 text-center border">Complexa</td>
                  <td className="p-4 text-center border bg-blue-50 font-medium">Fluida e intuitiva</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="#planos">
              <Button size="lg" className="bg-betBlue hover:bg-blue-700">
                Comece com a Betilha Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="tab1">Funcionalidades</TabsTrigger>
                <TabsTrigger value="tab2">Planos</TabsTrigger>
                <TabsTrigger value="tab3">IA e WhatsApp</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tab1">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Quais esportes posso gerenciar?</h3>
                    <p className="text-gray-600">A Betilha permite gerenciar apostas de qualquer esporte. Você pode registrar apostas de futebol, basquete, tênis, e-sports ou qualquer outro esporte ou evento.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Como o saldo da banca é atualizado?</h3>
                    <p className="text-gray-600">O saldo da banca é atualizado automaticamente em tempo real sempre que você registra, edita ou exclui uma aposta, seja pela plataforma web ou pelo WhatsApp.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Posso exportar meus relatórios?</h3>
                    <p className="text-gray-600">Sim, os assinantes podem exportar relatórios detalhados em formatos como PDF e CSV. Assinantes do plano anual têm acesso a relatórios premium com análises mais avançadas.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tab2">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Tem plano gratuito?</h3>
                    <p className="text-gray-600">Não, a Betilha é uma ferramenta profissional paga que oferece recursos avançados e IA integrada. Oferecemos diferentes planos para atender às suas necessidades, começando em R$ 50/mês.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Posso cancelar minha assinatura a qualquer momento?</h3>
                    <p className="text-gray-600">Sim, você pode cancelar sua assinatura a qualquer momento. O acesso continuará disponível até o final do período pago.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Qual a diferença entre os planos?</h3>
                    <p className="text-gray-600">Todos os planos incluem acesso completo à plataforma e IA integrada. A diferença está no preço mensal (mais econômico nos planos de maior duração) e no acesso a relatórios premium no plano anual.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tab3">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">A IA funciona em qualquer WhatsApp?</h3>
                    <p className="text-gray-600">Sim, nossa IA funciona em qualquer WhatsApp. Após assinar, você receberá um link para adicionar o assistente Betilha aos seus contatos.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">A IA entende mercados personalizados?</h3>
                    <p className="text-gray-600">Sim, nossa IA é treinada para entender e registrar mercados personalizados além dos mercados tradicionais, permitindo total flexibilidade no registro de suas apostas.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Preciso estar conectado à internet para usar a IA?</h3>
                    <p className="text-gray-600">Sim, a IA funciona através do WhatsApp, então é necessário uma conexão com a internet para registrar apostas e receber atualizações.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-betBlue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Profissionalize suas apostas. Tenha controle e dados. Aposte com estratégia.</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            A Betilha é a ferramenta que faltava para você ter consistência e resultado.
            Comece agora e tenha seu gerente de banca pessoal no WhatsApp.
          </p>
          <Link to="#planos">
            <Button size="lg" className="bg-white text-betBlue hover:bg-gray-100 px-8 py-6 text-lg">
              Assinar Agora e Liberar Minha IA
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
