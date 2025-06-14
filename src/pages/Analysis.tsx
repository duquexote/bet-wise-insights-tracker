import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import supabaseService, { Bet } from "@/services/supabaseService";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PerformanceByMarketCard = ({ bets }: { bets: Bet[] }) => {
  // Group by market
  const marketPerformance = bets.reduce<Record<string, { wins: number; losses: number; profit: number; count: number; winRate: number }>>((acc, bet) => {
    if (bet.resultado === 'VOID') return acc;
    
    if (!acc[bet.market]) {
      acc[bet.market] = { wins: 0, losses: 0, profit: 0, count: 0, winRate: 0 };
    }
    
    acc[bet.market].count++;
    acc[bet.market].profit += parseFloat(bet.lucro_perda || '0');
    
    if (bet.resultado === 'GREEN') {
      acc[bet.market].wins++;
    } else if (bet.resultado === 'RED') {
      acc[bet.market].losses++;
    }
    
    // Calcular a taxa de acerto apenas para apostas finalizadas (GREEN ou RED)
    const finishedBets = acc[bet.market].wins + acc[bet.market].losses;
    if (finishedBets > 0) {
      acc[bet.market].winRate = (acc[bet.market].wins / finishedBets) * 100;
    }
    
    return acc;
  }, {});
  
  // Convert to array and sort by number of bets (count)
  const data = Object.entries(marketPerformance)
    .map(([market, stats]) => ({
      market,
      profit: stats.profit,
      winRate: stats.winRate,
      count: stats.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Get top 5 most bet markets
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho por Mercado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="market" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="profit"
                orientation="left"
                tickFormatter={(value) => `R$${value}`}
              />
              <YAxis 
                yAxisId="winRate"
                orientation="right"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "Lucro") return formatCurrency(Number(value));
                  if (name === "Taxa de Acerto") return `${Number(value).toFixed(2)}%`;
                  return value;
                }}
              />
              <Legend />
              <Bar 
                dataKey="profit" 
                name="Lucro" 
                fill="#0066CC" 
                yAxisId="profit"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="winRate" 
                name="Taxa de Acerto" 
                fill="#28A745" 
                yAxisId="winRate"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const OddsAnalysisCard = ({ bets }: { bets: Bet[] }) => {
  // Group by odds range
  const oddsRanges: Record<string, { count: number; wins: number; winRate: number; profit: number }> = {
    '1.0-1.5': { count: 0, wins: 0, winRate: 0, profit: 0 },
    '1.5-2.5': { count: 0, wins: 0, winRate: 0, profit: 0 },
    '2.5-5.0': { count: 0, wins: 0, winRate: 0, profit: 0 },
    '5.0+': { count: 0, wins: 0, winRate: 0, profit: 0 },
  };
  
  bets.forEach(bet => {
    if (bet.resultado === 'VOID') return;
    
    let range = '';
    const oddValue = parseFloat(bet.odd || '0');
    if (oddValue <= 1.5) range = '1.0-1.5';
    else if (oddValue <= 2.5) range = '1.5-2.5';
    else if (oddValue <= 5.0) range = '2.5-5.0';
    else range = '5.0+';
    
    oddsRanges[range].count++;
    // Adicionar lucro/prejuízo
    oddsRanges[range].profit += parseFloat(bet.lucro_perda || '0');
    
    if (bet.resultado === 'GREEN') {
      oddsRanges[range].wins++;
    }
  });
  
  // Calculate win rates
  Object.keys(oddsRanges).forEach(range => {
    if (oddsRanges[range].count > 0) {
      oddsRanges[range].winRate = (oddsRanges[range].wins / oddsRanges[range].count) * 100;
    }
  });
  
  // Convert to array for chart
  const data = Object.entries(oddsRanges)
    .map(([range, stats]) => ({
      range,
      count: stats.count,
      wins: stats.wins,
      winRate: stats.winRate,
      profit: stats.profit,
    }))
    .filter(item => item.count > 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Odds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" />
              <YAxis 
                yAxisId="count"
                orientation="left"
              />
              <YAxis 
                yAxisId="winRate"
                orientation="right"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-md">
                        <p className="font-medium">{data.range}</p>
                        <p>Apostas: {data.count}</p>
                        <p>Taxa de Acerto: {Number(data.winRate).toFixed(2)}%</p>
                        <p className={data.profit >= 0 ? 'text-betGreen' : 'text-betRed'}>Lucro/Prejuízo: {formatCurrency(data.profit)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Apostas" 
                fill="#6c757d" 
                yAxisId="count"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="winRate" 
                name="Taxa de Acerto" 
                fill="#0d6efd" 
                yAxisId="winRate"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const MarketAnalysisCard = ({ bets }: { bets: Bet[] }) => {
  const [selectedMarket, setSelectedMarket] = useState<string>('todos');
  
  // Get all unique markets
  const allMarkets = ['todos', ...Array.from(new Set(bets.map(bet => bet.market)))];
  
  // Filter bets by selected market
  const filteredBets = selectedMarket === 'todos' 
    ? bets 
    : bets.filter(bet => bet.market === selectedMarket);
  
  // Calculate wins, losses and profits
  const wins = filteredBets.filter(bet => bet.resultado === 'GREEN').length;
  const losses = filteredBets.filter(bet => bet.resultado === 'RED').length;
  const winProfit = filteredBets
    .filter(bet => bet.resultado === 'GREEN')
    .reduce((sum, bet) => sum + parseFloat(bet.lucro_perda || '0'), 0);
  const lossAmount = Math.abs(filteredBets
    .filter(bet => bet.resultado === 'RED')
    .reduce((sum, bet) => sum + parseFloat(bet.lucro_perda || '0'), 0));
  
  // Prepare data for pie chart
  const pieData = [
    { name: 'Vitórias', value: wins, profit: winProfit, color: '#22c55e' },
    { name: 'Derrotas', value: losses, profit: -lossAmount, color: '#ef4444' }
  ].filter(item => item.value > 0);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Apostas por Mercado</CardTitle>
        <div className="w-48">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar Mercado" />
            </SelectTrigger>
            <SelectContent>
              {allMarkets.map((market) => (
                <SelectItem key={market} value={market}>
                  {market === 'todos' ? 'Todos os Mercados' : market}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  const profit = props.payload.profit;
                  const formattedProfit = profit < 0 ? formatCurrency(profit) : formatCurrency(profit);
                  return [`${value} apostas (${formattedProfit})`, props.payload.name];
                }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const Analysis = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated || !user) {
          throw new Error('Usuário não autenticado');
        }
        
        const betsData = await supabaseService.getBets(user.id);
        setBets(betsData);
      } catch (error) {
        console.error('Error fetching bets data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados para análise.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, user, isAuthenticated]);

  // Filter bets based on selected timeframe
  const filteredBets = bets.filter(bet => {
    if (timeframe === 'all') return true;
    
    const betDate = new Date(bet.aposta_data || bet.created_at || '');
    const now = new Date();
    
    switch (timeframe) {
      case '7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return betDate >= sevenDaysAgo;
      case '30days':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return betDate >= thirtyDaysAgo;
      case '90days':
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 90);
        return betDate >= ninetyDaysAgo;
      default:
        return true;
    }
  });

  // Overall stats for the selected period
  const completedBets = filteredBets.filter(bet => bet.resultado !== 'VOID');
  const totalStake = completedBets.reduce((sum, bet) => sum + parseFloat(bet.stake_valor || '0'), 0);
  const totalProfit = completedBets.reduce((sum, bet) => sum + parseFloat(bet.lucro_perda || '0'), 0);
  const winningBets = completedBets.filter(bet => bet.resultado === 'GREEN').length;
  const winRate = completedBets.length > 0 ? (winningBets / completedBets.length) * 100 : 0;
  const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-betBlue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Análise</h2>
          <p className="text-gray-500">Insights detalhados sobre seu desempenho nas apostas.</p>
        </div>
        <div className="w-full md:w-48">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Apostas</p>
              <p className="text-2xl font-bold">{completedBets.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
              <p className="text-2xl font-bold">{formatPercentage(winRate)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className={`text-2xl font-bold ${roi >= 0 ? 'text-betGreen' : 'text-betRed'}`}>
                {formatPercentage(roi)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lucro/Prejuízo</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-betGreen' : 'text-betRed'}`}>
                {formatCurrency(totalProfit)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Analysis charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceByMarketCard bets={filteredBets} />
        <OddsAnalysisCard bets={filteredBets} />
        <MarketAnalysisCard bets={filteredBets} />
      </div>
    </div>
  );
};

export default Analysis;
