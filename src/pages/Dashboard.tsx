import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import supabaseService, { DashboardStats, Bet, ChartData } from "@/services/supabaseService";
import { formatCurrency, formatPercentage, formatDate } from "@/utils/formatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

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
  const completedBets = bets.filter(bet => bet.resultado !== 'PENDING');
  const wins = completedBets.filter(bet => bet.resultado === 'GREEN').length;
  const losses = completedBets.filter(bet => bet.resultado === 'RED').length;
  const pending = bets.filter(bet => bet.resultado === 'PENDING').length;
  
  const totalStake = completedBets.reduce((sum, bet) => sum + bet.stake_valor, 0);
  const totalProfit = completedBets.reduce((sum, bet) => sum + bet.lucro_perda, 0);
  
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
              <Tooltip formatter={(value) => value} />
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
                  <XCircle className="w-5 h-5 text-red-500" />
                }
                <div>
                  <div className="font-medium">{bet.partida}</div>
                  <div className="text-sm text-muted-foreground">{bet.mercado} • Odd {bet.odd.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{new Date(bet.aposta_data || '').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${bet.resultado === 'GREEN' ? 'text-green-500' : 'text-red-500'}`}>
                  {bet.resultado === 'GREEN' ? 'Ganho' : 'Perda'}
                </div>
                <div className={`text-sm ${bet.lucro_perda >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {bet.lucro_perda >= 0 ? '+' : '-'}R$ {Math.abs(bet.lucro_perda).toFixed(2)}
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
              <Tooltip 
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
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated || !user) {
          throw new Error('Usuário não autenticado');
        }

        const betsData = await supabaseService.getBets(user.id);
        setBets(betsData);

        const userSaldo = user.saldo_banca ? parseFloat(user.saldo_banca.toString()) : undefined;
        const statsData = supabaseService.calculateStats(betsData, userSaldo);
        setStats(statsData);

        const chartData = supabaseService.generateChartData(betsData);
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching bets:', error);
        toast({
          title: "Erro ao carregar apostas",
          description: "Não foi possível carregar suas apostas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, toast]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    if (isAuthenticated && user) {
      console.log('[Dashboard] Iniciando realtime para usuário:', user.id);
      
      unsubscribe = supabaseService.subscribeToBetsChanges(user.id, (updatedBets) => {
        console.log('[Dashboard] Recebeu atualização de apostas:', updatedBets.length);
        setBets(updatedBets);

        const userSaldo = user.saldo_banca ? parseFloat(user.saldo_banca.toString()) : undefined;
        console.log('[Dashboard] Saldo do usuário:', userSaldo);

        const statsData = supabaseService.calculateStats(updatedBets, userSaldo);
        console.log('[Dashboard] Estatísticas calculadas:', statsData);
        setStats(statsData);

        const chartData = supabaseService.generateChartData(updatedBets);
        console.log('[Dashboard] Dados do gráfico gerados');
        setChartData(chartData);

        toast({
          title: "Dados atualizados",
          description: "Os dados das apostas foram atualizados.",
        });
      });
    } else {
      console.log('[Dashboard] Usuário não autenticado ou sem ID');
    }

    return () => {
      if (unsubscribe) {
        console.log('[Dashboard] Cancelando inscrição realtime');
        unsubscribe();
      }
    };
  }, [user, isAuthenticated, toast]); // Dependência no ID do usuário para recriar a inscrição se o usuário mudar

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo"
          value={stats.balance}
          icon={<TrendingUp className="h-5 w-5" />}
          isCurrency
        />
        <StatCard
          title="ROI"
          value={stats.roi}
          icon={<TrendingUp className="h-5 w-5" />}
          isPercentage
        />
        <StatCard
          title="Total de Apostas"
          value={stats.betCount}
          icon={<TrendingUp className="h-5 w-5" />}
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
        <BetResultsCard bets={bets} />
      </div>

      <div className="grid grid-cols-1">
        <RecentBetsCard bets={bets} />
      </div>
    </div>
  );
};

export default Dashboard;
