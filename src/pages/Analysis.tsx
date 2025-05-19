
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
import { mockDataService, Bet } from "@/services/mockData";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
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
    if (bet.result === 'pending') return acc;
    
    if (!acc[bet.market]) {
      acc[bet.market] = { wins: 0, losses: 0, profit: 0, count: 0, winRate: 0 };
    }
    
    acc[bet.market].count++;
    acc[bet.market].profit += bet.profit;
    
    if (bet.result === 'win') {
      acc[bet.market].wins++;
    } else {
      acc[bet.market].losses++;
    }
    
    acc[bet.market].winRate = (acc[bet.market].wins / acc[bet.market].count) * 100;
    
    return acc;
  }, {});
  
  // Convert to array and sort by profit
  const data = Object.entries(marketPerformance)
    .map(([market, stats]) => ({
      market,
      profit: stats.profit,
      winRate: stats.winRate,
      count: stats.count,
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 6); // Get top 6
  
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
  const oddsRanges: Record<string, { count: number; wins: number; winRate: number }> = {
    '1.01-1.50': { count: 0, wins: 0, winRate: 0 },
    '1.51-2.00': { count: 0, wins: 0, winRate: 0 },
    '2.01-2.50': { count: 0, wins: 0, winRate: 0 },
    '2.51-3.00': { count: 0, wins: 0, winRate: 0 },
    '3.01+': { count: 0, wins: 0, winRate: 0 },
  };
  
  bets.forEach(bet => {
    if (bet.result === 'pending') return;
    
    let range = '';
    if (bet.odds <= 1.5) range = '1.01-1.50';
    else if (bet.odds <= 2.0) range = '1.51-2.00';
    else if (bet.odds <= 2.5) range = '2.01-2.50';
    else if (bet.odds <= 3.0) range = '2.51-3.00';
    else range = '3.01+';
    
    oddsRanges[range].count++;
    if (bet.result === 'win') {
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
                formatter={(value, name) => {
                  if (name === "Apostas") return value;
                  if (name === "Taxa de Acerto") return `${Number(value).toFixed(2)}%`;
                  return value;
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

const SportAnalysisCard = ({ bets }: { bets: Bet[] }) => {
  // Group by sport
  const sportPerformance = bets.reduce<Record<string, { count: number; profit: number; }>>((acc, bet) => {
    if (bet.result === 'pending') return acc;
    
    if (!acc[bet.sport]) {
      acc[bet.sport] = { count: 0, profit: 0 };
    }
    
    acc[bet.sport].count++;
    acc[bet.sport].profit += bet.profit;
    
    return acc;
  }, {});
  
  // Convert to array for chart
  const data = Object.entries(sportPerformance)
    .map(([sport, stats]) => ({
      sport,
      profit: stats.profit,
      value: stats.count,
    }))
    .filter(item => item.value > 0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#4ECDC4'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apostas por Esporte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} apostas (${formatCurrency(props.payload.profit)})`, 
                  props.payload.sport
                ]}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const StakeAnalysisCard = ({ bets }: { bets: Bet[] }) => {
  // Calculate profit by stake ranges
  const stakeRanges: Record<string, { count: number; profit: number; roi: number; totalStake: number }> = {
    '0-25': { count: 0, profit: 0, roi: 0, totalStake: 0 },
    '26-50': { count: 0, profit: 0, roi: 0, totalStake: 0 },
    '51-100': { count: 0, profit: 0, roi: 0, totalStake: 0 },
    '101+': { count: 0, profit: 0, roi: 0, totalStake: 0 },
  };
  
  bets.forEach(bet => {
    if (bet.result === 'pending') return;
    
    let range = '';
    if (bet.stake <= 25) range = '0-25';
    else if (bet.stake <= 50) range = '26-50';
    else if (bet.stake <= 100) range = '51-100';
    else range = '101+';
    
    stakeRanges[range].count++;
    stakeRanges[range].profit += bet.profit;
    stakeRanges[range].totalStake += bet.stake;
  });
  
  // Calculate ROI
  Object.keys(stakeRanges).forEach(range => {
    if (stakeRanges[range].totalStake > 0) {
      stakeRanges[range].roi = (stakeRanges[range].profit / stakeRanges[range].totalStake) * 100;
    }
  });
  
  // Convert to array for chart
  const data = Object.entries(stakeRanges)
    .map(([range, stats]) => ({
      range,
      profit: stats.profit,
      roi: stats.roi,
      count: stats.count,
    }))
    .filter(item => item.count > 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Stake</CardTitle>
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
                yAxisId="profit"
                orientation="left"
                tickFormatter={(value) => `R$${value}`}
              />
              <YAxis 
                yAxisId="roi"
                orientation="right"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "Lucro") return formatCurrency(Number(value));
                  if (name === "ROI") return `${Number(value).toFixed(2)}%`;
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
                dataKey="roi" 
                name="ROI" 
                fill="#28A745" 
                yAxisId="roi"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const betsData = await mockDataService.getBets();
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
  }, [toast]);

  // Filter bets based on selected timeframe
  const filteredBets = bets.filter(bet => {
    if (timeframe === 'all') return true;
    
    const betDate = new Date(bet.createdAt);
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
  const completedBets = filteredBets.filter(bet => bet.result !== 'pending');
  const totalStake = completedBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalProfit = completedBets.reduce((sum, bet) => sum + bet.profit, 0);
  const winningBets = completedBets.filter(bet => bet.result === 'win').length;
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
        <SportAnalysisCard bets={filteredBets} />
        <StakeAnalysisCard bets={filteredBets} />
      </div>
    </div>
  );
};

export default Analysis;
