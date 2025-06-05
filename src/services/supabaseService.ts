import { createClient } from '@supabase/supabase-js';

// Tipos
export interface User {
  id: string;
  email: string;
  phone?: string;
  nome?: string;
  external_id?: string;
  saldo_banca?: number;
}

export interface Bet {
  id: string;
  user_id: string;
  created_at?: string;
  createdAt?: string; // Para compatibilidade com o código existente
  partida: string;
  market: string;
  resultado: 'GREEN' | 'RED' | 'PENDING';
  lucro_perda: number;
  odd: number;
  stake_valor: number;
  aposta_data: string;
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

// URL e chave anônima do Supabase
// Usando variáveis de ambiente do Vite para maior segurança
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Verificação de segurança para garantir que as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente do Supabase não estão definidas. Verifique o arquivo .env');
}

// Cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para callbacks de real-time
type UserRealtimeCallback = (user: User) => void;
type BetsRealtimeCallback = (bets: Bet[]) => void;

// Serviço de autenticação e dados
const supabaseService = {
  // Autenticação com email e telefone (método legado)
  login: async (email: string, phone: string): Promise<User | null> => {
    try {
      console.log('Tentando login com email e telefone:', { email, phone });
      
      // Buscar usuário pelo email e telefone
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('external_id', phone)
        .single();

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
      }

      if (!data) {
        console.error('Usuário não encontrado');
        return null;
      }

      console.log('Usuário encontrado:', data);

      return {
        id: data.id,
        email: data.email,
        phone: data.external_id,
        nome: data.nome,
        saldo_banca: data.saldo_banca,
        external_id: data.external_id
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return null;
    }
  },
  
  // Autenticação com email e senha (usando o sistema nativo do Supabase)
  loginWithPassword: async (email: string, password: string): Promise<User | null> => {
    try {
      console.log('Tentando login com email e senha:', { email });
      
      // Autenticar usando o sistema nativo do Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError || !authData.user) {
        console.error('Erro na autenticação:', authError);
        return null;
      }
      
      // Buscar dados do usuário na tabela personalizada usando o ID da autenticação
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (userError || !userData) {
        console.error('Erro ao buscar dados do usuário:', userError);
        return null;
      }
      
      console.log('Usuário autenticado com senha:', userData);
      
      return {
        id: userData.id,
        email: userData.email,
        phone: userData.external_id,
        nome: userData.nome,
        saldo_banca: userData.saldo_banca,
        external_id: userData.external_id
      };
    } catch (error) {
      console.error('Erro no login com senha:', error);
      return null;
    }
  },
  
  // Registrar um novo usuário
  registerUser: async (email: string, password: string, userData: Partial<User>): Promise<User | null> => {
    try {
      // Registrar o usuário no sistema de autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: userData.nome,
            phone: userData.external_id
          }
        }
      });
      
      if (authError || !authData.user) {
        console.error('Erro ao registrar usuário:', authError);
        return null;
      }
      
      // Inserir dados adicionais na tabela personalizada
      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id, // Usar o mesmo ID da autenticação
            email: email,
            external_id: userData.external_id,
            nome: userData.nome,
            saldo_banca: userData.saldo_banca || 0,
            assinatura_ativa: true
          }
        ])
        .select()
        .single();
      
      if (insertError) {
        console.error('Erro ao inserir dados do usuário:', insertError);
        return null;
      }
      
      return {
        id: newUserData.id,
        email: newUserData.email,
        phone: newUserData.external_id,
        nome: newUserData.nome,
        saldo_banca: newUserData.saldo_banca,
        external_id: newUserData.external_id
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return null;
    }
  },
  
  // Alterar senha do usuário usando o sistema nativo do Supabase
  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      console.log('Tentando alterar senha');
      
      // Usar a API nativa do Supabase para alterar a senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Erro ao alterar senha:', error);
        return false;
      }
      
      console.log('Senha alterada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    }
  },

  // Obter apostas do usuário
  getBets: async (userId: string): Promise<Bet[]> => {
    try {
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bets:', error);
        return [];
      }

      // Mapear os dados do banco para o formato usado pelo frontend
      return (data || []).map(bet => ({
        ...bet,
        createdAt: bet.created_at,
        match: bet.partida,
        selection: bet.market.split('—').pop()?.trim() || '',
        odds: bet.odd,
        stake: bet.stake_valor,
        result: bet.resultado === 'GREEN' ? 'win' : bet.resultado === 'RED' ? 'loss' : 'pending',
        profit: bet.lucro_perda,
        source: 'web'
      }));
    } catch (error) {
      console.error('Error fetching bets:', error);
      return [];
    }
  },

  // Calcular estatísticas com base nas apostas e no usuário
  calculateStats: (bets: Bet[], userSaldo?: number): DashboardStats => {
    const completedBets = bets.filter(bet => bet.resultado !== 'PENDING');
    const winningBets = completedBets.filter(bet => bet.resultado === 'GREEN');
    
    const totalStake = completedBets.reduce((sum, bet) => sum + bet.stake_valor, 0);
    const totalProfit = completedBets.reduce((sum, bet) => sum + bet.lucro_perda, 0);
    
    // Usar o saldo da banca do usuário se disponível, caso contrário calcular com base nas apostas
    const balance = userSaldo !== undefined ? parseFloat(userSaldo.toFixed(2)) : parseFloat((totalStake + totalProfit).toFixed(2));
    
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
      averageOdds: parseFloat((completedBets.reduce((sum, bet) => sum + bet.odd, 0) / completedBets.length || 0).toFixed(2))
    };
  },

  // Gerar dados do gráfico com base nas apostas
  generateChartData: (bets: Bet[]): ChartData[] => {
    // Ordenar apostas por data
    const sortedBets = [...bets].sort((a, b) => 
      new Date(a.aposta_data || '').getTime() - new Date(b.aposta_data || '').getTime()
    );

    // Inicializar acumulador
    let balance = 0;
    
    // Gerar pontos do gráfico
    return sortedBets.map(bet => {
      if (bet.resultado !== 'PENDING') {
        balance += bet.lucro_perda;
      }
      
      return {
        date: bet.aposta_data || '',
        balance: parseFloat(balance.toFixed(2))
      };
    });
  },

  // Obter estatísticas do dashboard
  getStats: async (userId: string): Promise<DashboardStats | null> => {
    try {
      const bets = await supabaseService.getBets(userId);
      if (!bets.length) return null;
      
      return supabaseService.calculateStats(bets);
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  },

  // Obter dados do gráfico
  getChartData: async (userId: string): Promise<ChartData[]> => {
    try {
      const bets = await supabaseService.getBets(userId);
      if (!bets.length) return [];
      
      return supabaseService.generateChartData(bets);
    } catch (error) {
      console.error('Error getting chart data:', error);
      return [];
    }
  },

  // Obter uma aposta específica pelo ID
  getBetById: async (id: string): Promise<Bet | null> => {
    try {
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar aposta:', error);
        return null;
      }

      return data as Bet;
    } catch (error) {
      console.error('Erro ao buscar aposta:', error);
      return null;
    }
  },

  // Atualizar o saldo da banca do usuário com base em suas apostas
  updateUserBalance: async (userId: string): Promise<boolean> => {
    try {
      console.log('[Supabase] Iniciando atualização do saldo da banca para o usuário:', userId);
      
      // Buscar todas as apostas do usuário
      const bets = await supabaseService.getBets(userId);
      console.log(`[Supabase] Encontradas ${bets.length} apostas para o usuário`);
      
      // Calcular o saldo com base nas apostas
      let balance = 0;
      
      // Filtrar apostas com resultado (excluir PENDING)
      const completedBets = bets.filter(bet => bet.resultado !== 'PENDING');
      console.log(`[Supabase] ${completedBets.length} apostas com resultado definido (GREEN/RED)`);
      
      // Calcular o saldo somando lucro/perda de todas as apostas
      if (completedBets.length > 0) {
        balance = completedBets.reduce((sum, bet) => sum + bet.lucro_perda, 0);
        console.log('[Supabase] Detalhes do cálculo do saldo:');
        completedBets.forEach(bet => {
          console.log(`[Supabase] Aposta ${bet.id}: ${bet.partida} - ${bet.resultado} - Lucro/Perda: ${bet.lucro_perda}`);
        });
      }
      
      console.log('[Supabase] Novo saldo calculado:', balance);
      
      // Verificar o saldo atual do usuário antes de atualizar
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('saldo_banca')
        .eq('id', userId)
        .single();
        
      if (fetchError) {
        console.error('[Supabase] Erro ao buscar saldo atual do usuário:', fetchError);
        return false;
      }
      
      console.log('[Supabase] Saldo atual do usuário no banco:', userData?.saldo_banca);
      
      // Atualizar o saldo do usuário no banco de dados
      const { error } = await supabase
        .from('users')
        .update({ saldo_banca: balance })
        .eq('id', userId);
        
      if (error) {
        console.error('[Supabase] Erro ao atualizar saldo do usuário:', error);
        return false;
      }
      
      console.log('[Supabase] Saldo da banca atualizado com sucesso de', userData?.saldo_banca, 'para', balance);
      return true;
    } catch (error) {
      console.error('[Supabase] Erro ao atualizar saldo da banca:', error);
      return false;
    }
  },
  
  // Criar uma nova aposta
  createBet: async (bet: Omit<Bet, 'id' | 'created_at'>): Promise<Bet | null> => {
    try {
      const { data, error } = await supabase
        .from('bets')
        .insert([bet])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar aposta:', error);
        return null;
      }
      
      // Atualizar o saldo da banca do usuário
      if (data) {
        await supabaseService.updateUserBalance(data.user_id);
      }

      return data as Bet;
    } catch (error) {
      console.error('Erro ao criar aposta:', error);
      return null;
    }
  },

  // Atualizar uma aposta existente
  updateBet: async (id: string, bet: Partial<Omit<Bet, 'id' | 'created_at' | 'user_id'>>): Promise<Bet | null> => {
    try {
      // Primeiro, obter a aposta atual para saber o user_id
      const { data: currentBet, error: fetchError } = await supabase
        .from('bets')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar aposta atual:', fetchError);
        return null;
      }

      // Atualizar a aposta
      const { data, error } = await supabase
        .from('bets')
        .update(bet)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar aposta:', error);
        return null;
      }

      // Atualizar o saldo da banca do usuário
      if (currentBet && data) {
        await supabaseService.updateUserBalance(currentBet.user_id);
      }

      return data as Bet;
    } catch (error) {
      console.error('Erro ao atualizar aposta:', error);
      return null;
    }
  },

  // Excluir uma aposta
  deleteBet: async (id: string, userId: string): Promise<boolean> => {
    try {
      console.log('Supabase: Iniciando exclusão da aposta com ID:', id, 'por usuário:', userId);
      
      // Verificar se a aposta existe e pertence ao usuário fornecido
      const { data: existingBet, error: fetchError } = await supabase
        .from('bets')
        .select('id, user_id')
        .eq('id', id)
        .eq('user_id', userId) // Garantir que a aposta pertence ao usuário
        .single();
      
      if (fetchError) {
        console.error('Supabase: Erro ao verificar existência da aposta:', fetchError);
        return false;
      }
      
      if (!existingBet) {
        console.error('Supabase: Aposta não encontrada com ID:', id, 'para o usuário:', userId);
        return false;
      }
      
      console.log('Supabase: Aposta encontrada:', existingBet);
      
      // Excluir a aposta
      const { error } = await supabase
        .from('bets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Garantir que apenas apostas do usuário atual sejam excluídas

      if (error) {
        console.error('Supabase: Erro ao excluir aposta:', error);
        return false;
      }

      // Atualizar o saldo da banca do usuário após excluir a aposta
      await supabaseService.updateUserBalance(userId);

      console.log('Supabase: Aposta excluída com sucesso:', id);
      return true;
    } catch (error) {
      console.error('Supabase: Erro inesperado ao excluir aposta:', error);
      return false;
    }
  },

  // Inscrever-se para atualizações em tempo real da tabela users
  subscribeToUserChanges: (userId: string, callback: UserRealtimeCallback) => {
    const subscription = supabase
      .channel(`public:users:id=eq.${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', // Escutar todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        }, 
        async (payload) => {
          // Quando houver uma mudança no usuário, buscar os dados atualizados
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

          if (!error && data) {
            // Mapear para o formato usado pelo frontend
            const user: User = {
              id: data.id,
              email: data.email,
              phone: data.external_id,
              nome: data.nome,
              saldo_banca: data.saldo_banca
            };
            callback(user);
          }
        }
      )
      .subscribe();

    // Retornar a função para cancelar a inscrição
    return () => {
      supabase.removeChannel(subscription);
    };
  },

  // Inscrever-se para atualizações em tempo real da tabela bets
  subscribeToBetsChanges: (userId: string, callback: BetsRealtimeCallback) => {
    console.log('[Supabase] Iniciando inscrição realtime para usuário:', userId);
    
    const subscription = supabase
      .channel(`public:bets:user_id=eq.${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', // Escutar todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'bets',
          filter: `user_id=eq.${userId}`
        }, 
        async (payload) => {
          console.log('[Supabase] Evento realtime recebido:', payload);
          // Quando houver uma mudança nas apostas, buscar todas as apostas atualizadas
          const bets = await supabaseService.getBets(userId);
          console.log('[Supabase] Buscou apostas atualizadas:', bets.length);
          callback(bets);
        }
      )
      .subscribe();

    console.log('[Supabase] Canal inscrito com sucesso');

    // Retornar a função para cancelar a inscrição
    return () => {
      console.log('[Supabase] Cancelando inscrição do canal');
      supabase.removeChannel(subscription);
    };
  },
};

export default supabaseService;
