
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { mockDataService, Bet } from "@/services/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Search, CheckCircle, XCircle, Clock, Filter, Download } from "lucide-react";

const BetsTable = ({ bets }: { bets: Bet[] }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Partida</TableHead>
            <TableHead>Mercado</TableHead>
            <TableHead>Seleção</TableHead>
            <TableHead>Odd</TableHead>
            <TableHead>Stake</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead className="text-right">Lucro/Prejuízo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.length > 0 ? (
            bets.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>{formatDate(bet.createdAt)}</TableCell>
                <TableCell>{bet.match}</TableCell>
                <TableCell>{bet.market}</TableCell>
                <TableCell>{bet.selection}</TableCell>
                <TableCell>{bet.odds}</TableCell>
                <TableCell>{formatCurrency(bet.stake)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      bet.result === 'win' ? 'bg-betGreen' : 
                      bet.result === 'loss' ? 'bg-betRed' : 
                      'bg-betGray'
                    }`}></div>
                    <span>
                      {bet.result === 'win' ? 'Ganho' : 
                       bet.result === 'loss' ? 'Perda' : 
                       'Pendente'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className={`text-right ${
                  bet.result === 'win' ? 'text-betGreen font-medium' : 
                  bet.result === 'loss' ? 'text-betRed font-medium' : 
                  ''
                }`}>
                  {bet.result === 'win' ? '+' : bet.result === 'loss' ? '-' : ''}
                  {formatCurrency(Math.abs(bet.profit))}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhuma aposta encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const BetsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma aposta encontrada</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Nenhuma aposta corresponde aos seus filtros atuais. Tente ajustar seus filtros ou registre novas apostas.
      </p>
      <Button variant="outline">Registrar Nova Aposta</Button>
    </div>
  );
};

const BetsSummary = ({ bets }: { bets: Bet[] }) => {
  // Calculate summary data
  const completedBets = bets.filter(bet => bet.result !== 'pending');
  const wins = completedBets.filter(bet => bet.result === 'win').length;
  const losses = completedBets.filter(bet => bet.result === 'loss').length;
  const pending = bets.filter(bet => bet.result === 'pending').length;
  
  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalProfit = completedBets.reduce((sum, bet) => sum + bet.profit, 0);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total de Apostas</span>
            <span className="text-2xl font-bold">{bets.length}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Ganhos</span>
            <span className="text-2xl font-bold text-betGreen">{wins}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Perdas</span>
            <span className="text-2xl font-bold text-betRed">{losses}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Pendentes</span>
            <span className="text-2xl font-bold text-betGray">{pending}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Lucro/Prejuízo</span>
            <span className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-betGreen' : 'text-betRed'}`}>
              {formatCurrency(totalProfit)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Bets = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [filteredBets, setFilteredBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');
  const { toast } = useToast();

  // Fetch bets data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const betsData = await mockDataService.getBets();
        setBets(betsData);
        setFilteredBets(betsData);
      } catch (error) {
        console.error('Error fetching bets:', error);
        toast({
          title: "Erro ao carregar apostas",
          description: "Não foi possível carregar a lista de apostas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Apply filters
  useEffect(() => {
    let filtered = [...bets];
    
    // Apply result filter
    if (selectedResult !== 'all') {
      filtered = filtered.filter(bet => bet.result === selectedResult);
    }
    
    // Apply sport filter
    if (selectedSport !== 'all') {
      filtered = filtered.filter(bet => bet.sport === selectedSport);
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(bet => 
        bet.match.toLowerCase().includes(term) ||
        bet.market.toLowerCase().includes(term) ||
        bet.selection.toLowerCase().includes(term) ||
        bet.league.toLowerCase().includes(term)
      );
    }
    
    setFilteredBets(filtered);
  }, [bets, searchTerm, selectedResult, selectedSport]);

  // Extract unique sports for filter
  const sports = ['all', ...new Set(bets.map(bet => bet.sport))];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-betBlue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Minhas Apostas</h2>
        <p className="text-gray-500">Visualize e analise todas as suas apostas.</p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Buscar apostas..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-40">
                <Select value={selectedResult} onValueChange={setSelectedResult}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Resultado" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="win">Ganhos</SelectItem>
                    <SelectItem value="loss">Perdas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Esporte" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport === 'all' ? 'Todos' : sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary cards */}
      <BetsSummary bets={filteredBets} />
      
      {/* Tabs with table */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredBets.length > 0 ? <BetsTable bets={filteredBets} /> : <BetsEmptyState />}
        </TabsContent>
        <TabsContent value="whatsapp">
          {filteredBets.filter(bet => bet.source === 'whatsapp').length > 0 ? 
            <BetsTable bets={filteredBets.filter(bet => bet.source === 'whatsapp')} /> : 
            <BetsEmptyState />
          }
        </TabsContent>
        <TabsContent value="web">
          {filteredBets.filter(bet => bet.source === 'web').length > 0 ? 
            <BetsTable bets={filteredBets.filter(bet => bet.source === 'web')} /> : 
            <BetsEmptyState />
          }
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bets;
