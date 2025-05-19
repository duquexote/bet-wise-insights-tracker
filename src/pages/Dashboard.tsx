
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockDataService, DashboardStats, Bet, ChartData } from "@/services/mockData";
import { formatCurrency, formatPercentage, formatDate } from "@/utils/formatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

// Components
const StatCard = ({ title, value, icon, change = null, isPercentage = false, isCurrency = false }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {isCurrency ? formatCurrency(value) : isPercentage ? formatPercentage(value) : value}
            </p>
            {change !== null && (
              <div className={`flex items-center mt-1 text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? 
                  <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                }
                <span>{Math.abs(change)}% em relação ao período anterior</span>
              </div>
            )}
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BetResultsCard = ({ bets }: { bets: Bet[] }) => {
  // Filter out pending bets
  const completedBets = bets.filter(bet => bet.result !== 'pending');
  const wins = completedBets.filter(bet => bet.result === 'win').length;
  const losses = completedBets.filter(bet => bet.result === 'loss').length;
  
  const data = [
    { name: 'Ganhos', value: wins },
    { name: 'Perdas', value: losses }
  ];
  
  const COLORS = ['#28A745', '#DC3545'];
  
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
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip 
                formatter={(value) => [`${value} apostas`, '']} 
                labelFormatter={() => ''} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentBetsCard = ({ bets }: { bets: Bet[] }) => {
  const recentBets = bets.slice(0, 5); // Get last 5 bets
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Apostas Recentes</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          {recentBets.map((bet) => (
            <div key={bet.id} className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                bet.result === 'win' ? 'bg-green-100 text-green-600' :
                bet.result === 'loss' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {bet.result === 'win' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : bet.result === 'loss' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm truncate">{bet.match}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    bet.result === 'win' ? 'bg-green-100 text-green-800' :
                    bet.result === 'loss' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bet.result === 'win' ? 'Ganho' : bet.result === 'loss' ? 'Perda' : 'Pendente'}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>{bet.market}: {bet.selection}</span>
                  <span className="mx-1">•</span>
                  <span>Odd {bet.odds}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{formatDate(bet.createdAt)}</span>
                  <span className={`text-xs font-medium ${bet.result === 'win' ? 'text-green-600' : bet.result === 'loss' ? 'text-red-600' : 'text-gray-600'}`}>
                    {bet.result === 'win' ? '+' : bet.result === 'loss' ? '-' : ''}{formatCurrency(Math.abs(bet.profit))}
                  </span>
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
                formatter={(value) => [formatCurrency(Number(value)), 'Saldo']} 
                labelFormatter={(date) => formatDate(date)}
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data simultaneously with Promise.all
        const [statsData, betsData, chartData] = await Promise.all([
          mockDataService.getStats(),
          mockDataService.getBets(),
          mockDataService.getChartData()
        ]);
        
        setStats(statsData);
        setBets(betsData);
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-betBlue"></div>
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-500">Visualize o desempenho da sua banca de apostas.</p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Saldo da Banca" 
          value={stats.balance} 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          change={4.2}
          isCurrency={true}
        />
        <StatCard 
          title="Lucro/Prejuízo" 
          value={stats.profitLoss} 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          change={stats.profitLoss >= 0 ? 2.1 : -2.1}
          isCurrency={true}
        />
        <StatCard 
          title="ROI" 
          value={stats.roi} 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          change={1.5}
          isPercentage={true}
        />
        <StatCard 
          title="Taxa de Acerto" 
          value={stats.winRate} 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          change={0.8}
          isPercentage={true}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceChart chartData={chartData} />
        <BetResultsCard bets={bets} />
      </div>
      
      {/* Recent bets */}
      <div>
        <RecentBetsCard bets={bets} />
      </div>
    </div>
  );
};

export default Dashboard;
