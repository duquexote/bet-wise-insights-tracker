import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import supabaseService, { DashboardStats, Bet, ChartData } from "@/services/supabaseService";
import { formatCurrency, formatPercentage, formatDate } from "@/utils/formatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, CheckCircle2, XCircle, CalendarIcon, FilterIcon } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, subMonths, startOfDay, endOfDay } from "date-fns";
import { ptBR } from 'date-fns/locale';

// Components
const StatCard = ({ title, value, icon, isPercentage = false, isCurrency = false }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {isCurrency ? formatCurrency(value) : isPercentage ? formatPercentage(value) : value}
            </p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BetResultsCard = ({ bets }: { bets: Bet[] }) => {
  // Filter out pending bets
  const completedBets = bets.filter(bet => bet.resultado !== 'VOID' && bet.resultado !== 'PENDING');
  const wins = completedBets.filter(bet => bet.resultado === 'GREEN').length;
  const losses = completedBets.filter(bet => bet.resultado === 'RED').length;
  const pending = bets.filter(bet => bet.resultado === 'VOID' || bet.resultado === 'PENDING').length;
  
  const totalStake = completedBets.reduce((sum, bet) => sum + parseFloat(bet.stake_valor || '0'), 0);
  const totalProfit = completedBets.reduce((sum, bet) => sum + parseFloat(bet.lucro_perda || '0'), 0);
  
  const winRate = completedBets.length > 0
    ? (wins / completedBets.length) * 100
    : 0;

  const pieData = [
    { name: 'Vitórias', value: wins },
    { name: 'Derrotas', value: losses }
  ];

  const COLORS = ['#22c55e', '#ef4444'];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição de Resultados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => value} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentBetsCard = ({ bets }: { bets: Bet[] }) => {
  const recentBets = [...bets].sort((a, b) => {
    const dateA = new Date(a.aposta_data || '');
    const dateB = new Date(b.aposta_data || '');
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apostas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBets.map((bet, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                {bet.resultado === 'GREEN' ? 
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                  bet.resultado === 'RED' ? 
                  <XCircle className="w-5 h-5 text-red-500" /> :
                  <Clock className="w-5 h-5 text-yellow-500" />
                }
                <div>
                  <div className="font-medium">{bet.partida}</div>
                  <div className="text-sm text-muted-foreground">{bet.market} • Odd {parseFloat(bet.odd || '0').toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{new Date(bet.aposta_data || '').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${bet.resultado === 'GREEN' ? 'text-green-500' : bet.resultado === 'RED' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {bet.resultado === 'GREEN' ? 'Ganho' : bet.resultado === 'RED' ? 'Perda' : 'Pendente'}
                </div>
                <div className={`text-sm ${bet.resultado === 'PENDING' || bet.resultado === 'VOID' ? 'text-yellow-500' : parseFloat(bet.lucro_perda || '0') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {bet.resultado === 'PENDING' || bet.resultado === 'VOID' ? 
                    'Aguardando' : 
                    `${parseFloat(bet.lucro_perda || '0') >= 0 ? '+' : '-'}R$ ${Math.abs(parseFloat(bet.lucro_perda || '0')).toFixed(2)}`
                  }
                </div>
              </div>
            </div>
          ))}
          {recentBets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Nenhuma aposta recente</h3>
              <p className="text-gray-500 mt-1">Suas apostas mais recentes aparecerão aqui.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const BalanceChart = ({ chartData }: { chartData: ChartData[] }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Evolução da Banca</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tickFormatter={(value) => `R$${value}`}
                width={70}
              />
              <RechartsTooltip 
                formatter={(value: number) => [formatCurrency(value), 'Saldo'] as [string, string]}
                labelFormatter={(date: string) => formatDate(date)}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#0066CC" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [filteredBets, setFilteredBets] = useState<Bet[]>([]); // Apostas filtradas por data
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [allBets, setAllBets] = useState<Bet[]>([]);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true); // Controle do realtime
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Função para aplicar filtros de data
  const applyDateFilter = (betsData: Bet[], startDate?: Date, endDate?: Date) => {
    if (!user) return;
    
    // Usar a banca inicial do usuário ou o valor padrão
    const bancaInicial = user.banca_inicial || 100000;
    
    // Obter o saldo atual do usuário
    const userSaldo = user.saldo_banca;
    
    console.log('[Dashboard] Aplicando filtro de data:', { startDate, endDate, bancaInicial, userSaldo });
    
    // Filtrar apostas pelo período selecionado, se fornecido
    let betsToUse = [...betsData];
    if (startDate && endDate) {
      betsToUse = betsData.filter(bet => {
        const betDate = new Date(bet.aposta_data || '');
        return betDate >= startDate && betDate <= endDate;
      });
      console.log(`[Dashboard] Apostas filtradas: ${betsToUse.length} de ${betsData.length}`);
      setFilteredBets(betsToUse); // Armazenar apostas filtradas
      setBets(betsToUse); // Atualizar também o estado principal de apostas para garantir consistência
    } else {
      setFilteredBets(betsData); // Sem filtro, usar todas as apostas
      setBets(betsData); // Atualizar também o estado principal
    }
    
    // Calcular estatísticas com filtro de data
    const statsData = supabaseService.calculateStats(
      betsToUse, 
      userSaldo, 
      bancaInicial,
      startDate,
      endDate
    );
    console.log('[Dashboard] Estatísticas calculadas:', statsData);
    setStats(statsData);
    
    // Gerar dados para o gráfico com filtro de data
    const chartData = supabaseService.generateChartData(
      betsToUse, 
      bancaInicial,
      startDate,
      endDate
    );
    setChartData(chartData);
  };
  
  // Função para limpar filtros
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setIsFilterActive(false);
    // Reativar realtime quando o filtro é limpo
    setRealtimeEnabled(true);
    applyDateFilter(allBets);
    setFilteredBets(allBets); // Resetar para todas as apostas
    
    toast({
      title: "Filtro limpo",
      description: "Mostrando todos os dados em tempo real"
    });
  };
  
  // Função para aplicar o filtro de data selecionado
  const handleApplyFilter = () => {
    if (dateRange.from) {
      // Ajustar para início e fim do dia
      const startDate = startOfDay(dateRange.from);
      // Se tiver data final, usar ela, senão usar a mesma data inicial (filtro de um dia)
      const endDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      
      console.log('[Dashboard] Aplicando filtro:', { startDate, endDate });
      
      // Primeiro desativar realtime e definir estado de filtro ativo
      setRealtimeEnabled(false);
      setIsFilterActive(true);
      
      // Aplicar filtro imediatamente com os dados atuais
      applyDateFilter(allBets, startDate, endDate);
      
      // Mensagem diferente se for filtro de um dia ou período
      const message = startDate.toDateString() === endDate.toDateString() 
        ? `Mostrando dados de ${format(startDate, 'dd/MM/yyyy')}` 
        : `Mostrando dados de ${format(startDate, 'dd/MM/yyyy')} até ${format(endDate, 'dd/MM/yyyy')}`;
      
      toast({
        title: "Filtro aplicado",
        description: message
      });
    }
  };
  
  // Efeito para buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) return;
      
      setLoading(true);
      
      try {
        // Buscar apostas do usuário
        const fetchedBets = await supabaseService.getBets(user.id);
        setBets(fetchedBets);
        setAllBets(fetchedBets);
        setFilteredBets(fetchedBets); // Inicializar apostas filtradas com todas as apostas
        
        // Calcular estatísticas iniciais
        const userSaldo = user.saldo_banca;
        const bancaInicial = user.banca_inicial || 100000;
        
        const statsData = supabaseService.calculateStats(fetchedBets, userSaldo, bancaInicial);
        setStats(statsData);
        
        // Gerar dados para o gráfico com a banca inicial
        const chartData = supabaseService.generateChartData(fetchedBets, bancaInicial);
        setChartData(chartData);
      } catch (error) {
        console.error('[Dashboard] Erro ao buscar dados:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, toast]);

  // Inscrição para atualizações em tempo real
  useEffect(() => {
    let unsubscribeBets: (() => void) | null = null;
    
    // Só ativa o realtime se estiver autenticado, tiver usuário e o realtime estiver habilitado
    if (isAuthenticated && user && realtimeEnabled) {
      console.log('[Dashboard] Iniciando realtime para apostas do usuário:', user.id);
      
      // Inscrição para atualizações de apostas
      unsubscribeBets = supabaseService.subscribeToBetsChanges(user.id, async (updatedBets) => {
        console.log('[Dashboard] Recebeu atualização de apostas:', updatedBets.length);
        setBets(updatedBets);
        setAllBets(updatedBets); // Atualiza também allBets para manter sincronizado
        
        // Buscar o usuário atualizado para ter o saldo mais recente
        const updatedUser = await supabaseService.getUserById(user.id);
        
        // Recalcular estatísticas e gráfico com o saldo mais recente do usuário
        const userSaldo = updatedUser?.saldo_banca || user.saldo_banca;
        const bancaInicial = updatedUser?.banca_inicial || user.banca_inicial || 100000;
        
        console.log('[Dashboard] Saldo atualizado do usuário:', userSaldo);
        console.log('[Dashboard] Banca inicial para cálculos:', bancaInicial);
        
        // Quando o realtime está ativo, não deve haver filtro ativo
        // Mas verificamos mesmo assim por segurança
        if (!isFilterActive) {
          const statsData = supabaseService.calculateStats(updatedBets, userSaldo, bancaInicial);
          setStats(statsData);
          
          const chartData = supabaseService.generateChartData(updatedBets, bancaInicial);
          setChartData(chartData);
        }
      });
    }
    
    return () => {
      if (unsubscribeBets) {
        console.log('[Dashboard] Cancelando inscrição realtime de apostas');
        unsubscribeBets();
      }
    };
  }, [user, isAuthenticated, realtimeEnabled]); // Adicionado realtimeEnabled como dependência
  
  // Efeito para atualizar as estatísticas quando o usuário (incluindo saldo_banca) mudar ou quando o filtro mudar
  useEffect(() => {
    if (user && (bets.length > 0 || filteredBets.length > 0)) {
      console.log('[Dashboard] Recalculando estatísticas');
      console.log('[Dashboard] Saldo da banca atual:', user.saldo_banca);
      console.log('[Dashboard] Banca inicial do usuário:', user.banca_inicial);
      
      const userSaldo = user.saldo_banca ? parseFloat(user.saldo_banca.toString()) : undefined;
      // Garantir que a banca inicial seja mantida durante atualizações em tempo real
      const bancaInicial = user.banca_inicial || 100000; // Usar valor padrão de 100000 se não estiver definido
      
      console.log('[Dashboard] Usando banca inicial para cálculos:', bancaInicial);
      
      // Se o filtro estiver ativo, usar as apostas filtradas
      if (isFilterActive && dateRange.from) {
        const startDate = startOfDay(dateRange.from);
        const endDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        
        // Usar filteredBets ao invés de bets quando o filtro está ativo
        const betsToUse = filteredBets;
        console.log(`[Dashboard] Usando ${betsToUse.length} apostas filtradas para cálculos`);
        
        const statsData = supabaseService.calculateStats(betsToUse, userSaldo, bancaInicial, startDate, endDate);
        setStats(statsData);
        
        // Atualizar também o chartData com o filtro
        const chartData = supabaseService.generateChartData(betsToUse, bancaInicial, startDate, endDate);
        setChartData(chartData);
      } else if (!isFilterActive) {
        // Sem filtro, usar todos os dados
        console.log(`[Dashboard] Usando ${bets.length} apostas totais para cálculos`);
        const statsData = supabaseService.calculateStats(bets, userSaldo, bancaInicial);
        setStats(statsData);
        
        // Atualizar também o chartData sem filtro
        const chartData = supabaseService.generateChartData(bets, bancaInicial);
        setChartData(chartData);
      }
    }
  }, [user, bets, filteredBets, isFilterActive, dateRange]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Dados não disponíveis</h2>
          <p className="text-gray-600">Não foi possível carregar os dados do dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          {/* Filtro de Data */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    <span>
                      {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                    </span>
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({
                        from: range.from,
                        to: range.to
                      });
                    } else {
                      setDateRange({ from: undefined, to: undefined });
                    }
                  }}
                  locale={ptBR}
                  className="rounded-md border"
                />
                <div className="p-3 border-t flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setDateRange({ 
                    from: subMonths(new Date(), 1), 
                    to: new Date() 
                  })}>
                    Último mês
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleApplyFilter}
                    disabled={!dateRange.from}
                  >
                    Aplicar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {isFilterActive && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                Limpar filtro
              </Button>
            )}
          </div>
          
          {stats?.initialBalance !== undefined && (
            <div className="text-sm font-medium ml-auto">
              Banca Inicial: <span className="text-primary">{formatCurrency(stats.initialBalance)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Saldo"
          value={stats.balance}
          icon={<TrendingUp className="h-5 w-5" />}
          isCurrency
        />
        <StatCard
          title="% Lucro sobre Banca"
          value={stats.profitPercentage || 0}
          icon={<TrendingUp className="h-5 w-5" />}
          isPercentage
        />
        <StatCard
          title="Lucro/Prejuízo"
          value={stats.profitLoss}
          icon={<TrendingUp className="h-5 w-5" />}
          isCurrency
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total de Apostas"
          value={stats.betCount}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="ROI"
          value={stats.roi}
          icon={<TrendingUp className="h-5 w-5" />}
          isPercentage
        />
        <StatCard
          title="Taxa de Vitórias"
          value={stats.winRate}
          icon={<TrendingUp className="h-5 w-5" />}
          isPercentage
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceChart chartData={chartData} />
        <BetResultsCard bets={isFilterActive ? filteredBets : bets} />
      </div>

      <div className="grid grid-cols-1">
        <RecentBetsCard bets={isFilterActive ? filteredBets : bets} />
      </div>
    </div>
  );
};

export default Dashboard;
