
// Types
export interface Bet {
  id: string;
  createdAt: string;
  sport: string;
  league: string;
  match: string;
  market: string;
  selection: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss' | 'pending';
  profit: number;
  source: 'whatsapp' | 'web';
}

export interface DashboardStats {
  balance: number;
  roi: number;
  profitLoss: number;
  betCount: number;
  winRate: number;
  averageStake: number;
  averageOdds: number;
}

export interface ChartData {
  date: string;
  balance: number;
}

// Generate random mock data
const generateMockBets = (count: number): Bet[] => {
  const sports = ['Futebol', 'Basquete', 'Tênis', 'Vôlei', 'eSports'];
  const leagues = ['Brasileirão', 'Champions League', 'NBA', 'Roland Garros', 'Liga Mundial'];
  const markets = ['Resultado Final', 'Over/Under', 'Ambas Marcam', 'Handicap', 'Escanteios'];
  const results = ['win', 'loss', 'pending'] as const;
  
  const bets: Bet[] = [];
  
  for (let i = 0; i < count; i++) {
    const isWin = Math.random() > 0.5;
    const stake = parseFloat((Math.random() * 100 + 10).toFixed(2));
    const odds = parseFloat((Math.random() * 3 + 1.1).toFixed(2));
    const result = i < count - 5 ? (isWin ? 'win' : 'loss') : 'pending';
    const profit = result === 'win' ? parseFloat((stake * (odds - 1)).toFixed(2)) : result === 'loss' ? -stake : 0;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const sportIndex = Math.floor(Math.random() * sports.length);
    const sport = sports[sportIndex];
    
    const leagueIndex = Math.floor(Math.random() * leagues.length);
    const league = leagues[leagueIndex];
    
    const teams = ['Barcelona', 'Real Madrid', 'Liverpool', 'Bayern', 'PSG', 'Milan', 'Santos', 'Flamengo', 'Corinthians'];
    const team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team2 === team1) {
      team2 = teams[Math.floor(Math.random() * teams.length)];
    }
    
    const match = `${team1} vs ${team2}`;
    
    const marketIndex = Math.floor(Math.random() * markets.length);
    const market = markets[marketIndex];
    
    const selections = ['Casa', 'Fora', 'Empate', 'Over 2.5', 'Under 2.5', 'Sim', 'Não'];
    const selection = selections[Math.floor(Math.random() * selections.length)];
    
    bets.push({
      id: `bet-${i + 1}`,
      createdAt: date.toISOString(),
      sport,
      league,
      match,
      market,
      selection,
      odds,
      stake,
      result,
      profit,
      source: Math.random() > 0.7 ? 'web' : 'whatsapp'
    });
  }
  
  // Sort by date descending
  return bets.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Calculate dashboard stats based on bets
const calculateStats = (bets: Bet[]): DashboardStats => {
  const completedBets = bets.filter(bet => bet.result !== 'pending');
  const winningBets = bets.filter(bet => bet.result === 'win');
  
  const totalStake = completedBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalProfit = completedBets.reduce((sum, bet) => sum + bet.profit, 0);
  const balance = parseFloat((totalStake + totalProfit).toFixed(2));
  const roi = totalStake > 0 
    ? parseFloat(((totalProfit / totalStake) * 100).toFixed(2)) 
    : 0;
  
  return {
    balance,
    roi,
    profitLoss: parseFloat(totalProfit.toFixed(2)),
    betCount: bets.length,
    winRate: parseFloat(((winningBets.length / completedBets.length) * 100 || 0).toFixed(2)),
    averageStake: parseFloat((totalStake / completedBets.length || 0).toFixed(2)),
    averageOdds: parseFloat(
      (completedBets.reduce((sum, bet) => sum + bet.odds, 0) / completedBets.length || 0).toFixed(2)
    )
  };
};

// Generate chart data for balance evolution
const generateChartData = (bets: Bet[]): ChartData[] => {
  // Group bets by date
  const betsByDate = bets.reduce<Record<string, Bet[]>>((acc, bet) => {
    const date = new Date(bet.createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(bet);
    return acc;
  }, {});
  
  // Sort dates
  const sortedDates = Object.keys(betsByDate).sort();
  
  // Generate balance progression
  let runningBalance = 1000; // Starting balance
  const chartData: ChartData[] = [];
  
  sortedDates.forEach(date => {
    const dailyBets = betsByDate[date];
    const profitForDay = dailyBets.reduce((sum, bet) => {
      // Only count completed bets
      if (bet.result !== 'pending') {
        return sum + bet.profit;
      }
      return sum;
    }, 0);
    
    runningBalance += profitForDay;
    
    chartData.push({
      date,
      balance: parseFloat(runningBalance.toFixed(2))
    });
  });
  
  return chartData;
};

// Initialize mock data
const mockBets = generateMockBets(50);
const mockStats = calculateStats(mockBets);
const mockChartData = generateChartData(mockBets);

// Export mock data service
export const mockDataService = {
  getBets: () => Promise.resolve(mockBets),
  getStats: () => Promise.resolve(mockStats),
  getChartData: () => Promise.resolve(mockChartData),
  getBetById: (id: string) => Promise.resolve(mockBets.find(bet => bet.id === id) || null),
};
