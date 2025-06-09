
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import supabaseService, { Bet } from "@/services/supabaseService";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Search, CheckCircle, XCircle, Clock, Filter, Download, Edit, Plus, Check, ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Lista de mercados disponíveis
const marketOptions = [
  "Simples",
  "Dupla",
  "Múltipla",
  "Resultado Final (1X2)",
  "Dupla Hipótese",
  "Intervalo/Final do Jogo",
  "Resultado Exato",
  "Resultado em Ambos os Tempos",
  "Sem Gols (0x0)",
  "Primeiro a Marcar",
  "Último a Marcar",
  "Método de Vitória",
  "Vencer sem Sofrer Gol",
  "Para Vencer de Virada",
  "Total de Gols",
  "Mais/Menos por Time",
  "Gols nos Dois Tempos",
  "Gols Ímpares/Par",
  "Total por Jogador",
  "Minuto do 1º Gol",
  "Metade com Mais Gols",
  "Número Exato de Gols",
  "Ambos Marcam",
  "Ambos Marcam em Cada Tempo",
  "Resultado e Total de Gols",
  "Jogador a Qualquer Momento",
  "Jogador a Marcar 2+",
  "Jogador/Minuto do Gol",
  "Handicap",
  "Handicap Asiático",
  "Escanteios Asiáticos",
  "Total Asiático de Gols",
  "Handicap Intervalo",
  "Handicap Combos",
  "Escanteios Totais",
  "Corrida de Cantos",
  "Escanteios HT",
  "Escanteios por Time",
  "Primeiro a Bater Escanteio",
  "Time com Mais Escanteios",
  "Cartões Totais",
  "Cartões por Time",
  "Primeiro Cartão",
  "Cartão no 1º Tempo",
  "Jogador a Levar Cartão",
  "Jogador a Ser Expulso",
  "Minuto do Cartão",
  "Faltas Cometidas",
  "Faltas por Jogador",
  "Primeiro a Cometer Falta",
  "Substituições Totais",
  "Primeira Substituição",
  "Jogador/Marcador de Gol",
  "Jogador/Assistência",
  "Jogador/Chute ao Gol",
  "Jogador/Finalizações Totais",
  "Jogador/Faltas Cometidas",
  "Jogador/Sofrer Falta",
  "Jogador/Desarme",
  "Jogador Expulso",
  "Jogador com Mais Finalizações",
  "Jogador a Marcar + Levar Cartão",
  "Jogador com Mais Impedimentos",
  "Combinação Jogador/Resultado",
  "Jogador a Marcar + Cartão",
  "Jogador a Marcar + Vitória",
  "Jogador a Marcar em Ambos os Tempos",
  "Minuto a Minuto",
  "Resultado + Escanteios + Cartões",
  "Impedimentos",
  "Posse de Bola",
  "Chutes Fora do Gol",
  "Gols de Cabeça/Falta/Pênalti",
  "Para Ir aos Pênaltis",
  "Método do Gol",
  "Clean Sheet",
  "Jogador com Primeira Finalização"
];

// Schema de validação para o formulário de apostas
const betFormSchema = z.object({
  partida: z.string().min(3, { message: "A partida deve ter pelo menos 3 caracteres" }),
  market: z.string().min(2, { message: "O mercado deve ter pelo menos 2 caracteres" }),
  odd: z.coerce.number().min(1.01, { message: "A odd deve ser maior que 1.01" }),
  stake_valor: z.coerce.number().min(1, { message: "A stake deve ser maior que 1" }),
  resultado: z.enum(["GREEN", "RED", "PENDING", "VOID", "CASHOUT"]),
  aposta_data: z.date({ required_error: "A data da aposta é obrigatória" }),
  lucro_perda: z.coerce.number().optional(),
});

type BetFormValues = z.infer<typeof betFormSchema>;

const BetFormDialog = ({ 
  open, 
  setOpen, 
  onSubmit, 
  defaultValues,
  title,
  buttonText,
  betId
}: { 
  open: boolean, 
  setOpen: (open: boolean) => void, 
  onSubmit: (values: BetFormValues) => void, 
  defaultValues?: Partial<BetFormValues>,
  title: string,
  buttonText: string,
  betId?: string
}) => {
  const form = useForm<BetFormValues>({
    resolver: zodResolver(betFormSchema),
    defaultValues: defaultValues || {
      partida: "",
      market: "",
      odd: 1.5,
      stake_valor: 10,
      resultado: "PENDING",
      aposta_data: new Date(),
      lucro_perda: 0,
    },
  });
  
  // Atualizar o formulário quando os valores padrão mudarem
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [form, defaultValues]);

  // Calcular lucro/prejuízo com base na odd, stake e resultado
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (["odd", "stake_valor", "resultado"].includes(name || "")) {
        const odd = form.getValues("odd");
        const stake = form.getValues("stake_valor");
        const resultado = form.getValues("resultado");
        
        let lucroPerda = 0;
        if (resultado === "GREEN") {
          lucroPerda = stake * odd - stake;
        } else if (resultado === "RED") {
          lucroPerda = -stake;
        }
        
        form.setValue("lucro_perda", lucroPerda);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmitForm = (values: BetFormValues) => {
    // Calcular o lucro/perda com base no resultado
    let lucroPerda = 0;
    
    if (values.resultado === 'GREEN') {
      // Lucro = (odd - 1) * stake
      lucroPerda = (values.odd - 1) * values.stake_valor;
    } else if (values.resultado === 'RED') {
      // Perda = -stake
      lucroPerda = -values.stake_valor;
    }
    
    // Atualizar o lucro/perda no formulário
    values.lucro_perda = lucroPerda;
    
    // Garantir que a data seja processada corretamente
    // Criar uma nova data no fuso horário UTC para evitar problemas de conversão
    if (values.aposta_data) {
      const date = new Date(values.aposta_data);
      // Criar uma string ISO sem o componente de tempo e fuso horário
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      
      // Substituir a data original por uma nova data UTC
      values.aposta_data = new Date(`${year}-${month}-${day}T12:00:00Z`);
      console.log('[BetForm] Data processada:', values.aposta_data.toISOString());
    }
    
    // Enviar o formulário
    onSubmit(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os dados da aposta abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aposta_data"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Data da Aposta</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="resultado"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Resultado</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o resultado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GREEN">Green</SelectItem>
                        <SelectItem value="RED">Red</SelectItem>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="partida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partida</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Flamengo x Corinthians" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Mercado</FormLabel>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? field.value // Mostrar o valor real digitado pelo usuário
                              : "Selecione ou digite um mercado"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" onWheel={(e) => e.stopPropagation()}>
                        <Command>
                          <CommandInput 
                            placeholder="Pesquisar ou digitar novo mercado..." 
                            onValueChange={(value) => {
                              // Permite ao usuário definir um valor personalizado
                              if (value.trim() !== "") {
                                form.setValue("market", value);
                              }
                            }}
                          />
                          <CommandEmpty>
                            <div className="p-2 text-sm">
                              <p>Nenhum mercado encontrado.</p>
                              <p className="text-muted-foreground">Pressione Enter para usar o texto digitado como mercado personalizado.</p>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandList className="max-h-[300px] overflow-y-auto">
                              {marketOptions.map((market) => (
                                <CommandItem
                                  key={market}
                                  value={market}
                                  onSelect={() => {
                                    form.setValue("market", market);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      market === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {market}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="odd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odd</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stake_valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stake (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="lucro_perda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lucro/Prejuízo (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      disabled 
                      className="bg-gray-100"
                    />
                  </FormControl>
                  <FormDescription>
                    Calculado automaticamente com base nos valores acima
                    {betId && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        ID da aposta: {betId}
                      </div>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">{buttonText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Modal de confirmação para exclusão de apostas
const DeleteConfirmationDialog = ({
  open,
  setOpen,
  onConfirm,
  betId
}: {
  open: boolean,
  setOpen: (open: boolean) => void,
  onConfirm: () => void,
  betId: string
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta aposta? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            ID da aposta: {betId}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={() => {
            onConfirm();
            setOpen(false);
          }}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BetsTable = ({ bets, onEdit, onDelete }: { bets: Bet[], onEdit: (bet: Bet) => void, onDelete: (id: string) => void }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [betToDelete, setBetToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setBetToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (betToDelete) {
      onDelete(betToDelete);
      setBetToDelete(null);
    }
  };
  
  // Componente de cartão para visualização móvel
  const BetCard = ({ bet }: { bet: Bet }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{bet.partida}</div>
          <div className="text-sm text-muted-foreground">{formatDate(bet.aposta_data || '')}</div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(bet)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteClick(bet.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="text-xs text-muted-foreground">Mercado</div>
          <div className="text-sm truncate">{bet.market}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Odd</div>
          <div className="text-sm">{bet.odd}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Stake</div>
          <div className="text-sm">{formatCurrency(parseFloat(bet.stake_valor) || 0)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Lucro/Prejuízo</div>
          <div className={`text-sm ${parseFloat(bet.lucro_perda) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(parseFloat(bet.lucro_perda) || 0)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-xs text-muted-foreground mr-2">Resultado:</div>
        {bet.resultado === 'GREEN' ? (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Ganho</span>
          </div>
        ) : bet.resultado === 'RED' ? (
          <div className="flex items-center text-red-500">
            <XCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Perda</span>
          </div>
        ) : (
          <div className="flex items-center text-yellow-500">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">Pendente</span>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <>
      {/* Tabela para desktop */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Partida</TableHead>
              <TableHead>Mercado</TableHead>
              <TableHead>Odd</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Lucro/Prejuízo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.length > 0 ? (
              bets.map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell>{formatDate(bet.aposta_data || '')}</TableCell>
                  <TableCell>{bet.partida}</TableCell>
                  <TableCell>{bet.market}</TableCell>
                  <TableCell>{bet.odd}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(bet.stake_valor) || 0)}</TableCell>
                  <TableCell>
                    {bet.resultado === 'GREEN' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : bet.resultado === 'RED' ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : bet.resultado === 'PENDING' || bet.resultado === 'VOID' ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-500" />
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(parseFloat(bet.lucro_perda) || 0)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(bet)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(bet.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          <line x1="10" x2="10" y1="11" y2="17"/>
                          <line x1="14" x2="14" y1="11" y2="17"/>
                        </svg>
                      </Button>
                    </div>
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
      
      {/* Visualização de cartões para mobile */}
      <div className="md:hidden">
        {bets.length > 0 ? (
          bets.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))
        ) : (
          <div className="text-center py-8 border rounded-md">
            Nenhuma aposta encontrada.
          </div>
        )}
      </div>
      
      {/* Modal de confirmação de exclusão */}
      {betToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          betId={betToDelete}
        />
      )}
    </>
  );
};

const BetsEmptyState = ({ onAddBet }: { onAddBet: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma aposta encontrada</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Nenhuma aposta corresponde aos seus filtros atuais. Tente ajustar seus filtros ou registre novas apostas.
      </p>
      <Button variant="outline" onClick={onAddBet}>Registrar Nova Aposta</Button>
    </div>
  );
};

const BetsSummary = ({ bets }: { bets: Bet[] }) => {
  // Calculate summary data
  const completedBets = bets.filter(bet => bet.resultado !== 'PENDING' && bet.resultado !== 'VOID');
  const wins = completedBets.filter(bet => bet.resultado === 'GREEN').length;
  const losses = completedBets.filter(bet => bet.resultado === 'RED').length;
  const pending = bets.filter(bet => bet.resultado === 'PENDING' || bet.resultado === 'VOID').length;
  
  const totalStake = bets.reduce((sum, bet) => sum + (parseFloat(bet.stake_valor) || 0), 0);
  const totalProfit = completedBets.reduce((sum, bet) => sum + (parseFloat(bet.lucro_perda) || 0), 0);
  
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBet, setEditingBet] = useState<Bet | null>(null);

  const { toast } = useToast();

  const { user, isAuthenticated } = useAuth();

  // Fetch bets data
  const fetchBets = async () => {
    try {
      if (!isAuthenticated || !user) {
        throw new Error('Usuário não autenticado');
      }

      const betsData = await supabaseService.getBets(user.id);
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

  useEffect(() => {
    fetchBets();
  }, [toast, user, isAuthenticated]);

  // Apply filters
  useEffect(() => {
    let filtered = [...bets];
    
    // Apply result filter
    if (selectedResult !== 'all') {
      if (selectedResult === 'pending') {
        // Filtrar apostas pendentes (PENDING ou VOID)
        filtered = filtered.filter(bet => bet.resultado === 'PENDING' || bet.resultado === 'VOID');
      } else {
        const resultMap = {
          'win': 'GREEN',
          'loss': 'RED'
        };
        filtered = filtered.filter(bet => bet.resultado === resultMap[selectedResult]);
      }
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(bet => 
        bet.partida.toLowerCase().includes(term) ||
        bet.market.toLowerCase().includes(term)
      );
    }
    
    setFilteredBets(filtered);
  }, [bets, searchTerm, selectedResult]);

  // Handle adding a new bet
  const handleAddBet = () => {
    setEditingBet(null);
    setIsFormOpen(true);
  };

  // Handle editing a bet
  const handleEditBet = (bet: Bet) => {
    setEditingBet(bet);
    setIsFormOpen(true);
  };

  // Handle deleting a bet
  const handleDeleteBet = async (id: string) => {
    try {
      console.log('Tentando excluir aposta com ID:', id);
      
      if (!user || !isAuthenticated) {
        console.error('Usuário não autenticado');
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar autenticado para excluir apostas.",
          variant: "destructive",
        });
        return;
      }
      
      // Passar o ID do usuário junto com o ID da aposta para garantir a autenticação
      const result = await supabaseService.deleteBet(id, user.id);
      
      if (result) {
        console.log('Aposta excluída com sucesso no Supabase');
        toast({
          title: "Aposta excluída",
          description: "A aposta foi excluída com sucesso.",
        });
        
        // Atualizar a lista de apostas após a exclusão
        await fetchBets();
      } else {
        console.error('Falha ao excluir aposta no Supabase');
        toast({
          title: "Erro ao excluir aposta",
          description: "O servidor retornou um erro ao tentar excluir a aposta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao excluir aposta:', error);
      toast({
        title: "Erro ao excluir aposta",
        description: "Ocorreu um erro ao tentar excluir a aposta.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (values: z.infer<typeof betFormSchema>) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Converter a data para string no formato ISO
      const formattedValues = {
        ...values,
        aposta_data: values.aposta_data.toISOString()
      };

      if (editingBet) {
        // Update existing bet
        await supabaseService.updateBet(editingBet.id, {
          ...formattedValues,
          lucro_perda: String(formattedValues.lucro_perda),
          odd: String(formattedValues.odd),
          stake_valor: String(formattedValues.stake_valor)
        });
        toast({
          title: "Aposta atualizada",
          description: "A aposta foi atualizada com sucesso.",
        });
      } else {
        // Create new bet
        await supabaseService.createBet({
          ...formattedValues,
          user_id: user.id,
          partida: formattedValues.partida, // Garantir que campos obrigatórios estejam presentes
          market: formattedValues.market,
          resultado: formattedValues.resultado,
          odd: String(formattedValues.odd),
          stake_valor: String(formattedValues.stake_valor),
          lucro_perda: String(formattedValues.lucro_perda)
        });
        toast({
          title: "Aposta registrada",
          description: "A aposta foi registrada com sucesso.",
        });
      }

      // Refresh bets list
      await fetchBets();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving bet:', error);
      toast({
        title: "Erro ao salvar aposta",
        description: "Não foi possível salvar a aposta.",
        variant: "destructive",
      });
    }
  };

  // Não é necessário declarar o form aqui, pois ele é gerenciado pelo BetFormDialog

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-betBlue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Minhas Apostas</h2>
          <p className="text-gray-500">Visualize e analise todas as suas apostas.</p>
        </div>
        <Button onClick={handleAddBet} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nova Aposta
        </Button>
      </div>
      
      {/* Form Dialog */}
      <BetFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        onSubmit={handleFormSubmit}
        defaultValues={editingBet ? {
          partida: editingBet.partida,
          market: editingBet.market,
          odd: parseFloat(editingBet.odd),
          stake_valor: parseFloat(editingBet.stake_valor),
          resultado: editingBet.resultado,
          aposta_data: editingBet.aposta_data ? new Date(editingBet.aposta_data) : new Date(),
          lucro_perda: parseFloat(editingBet.lucro_perda),
        } : undefined}
        title={editingBet ? "Editar Aposta" : "Nova Aposta"}
        buttonText={editingBet ? "Atualizar" : "Registrar"}
        betId={editingBet?.id}
      />
      
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
                    <SelectValue placeholder="Resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="win">Ganhos</SelectItem>
                    <SelectItem value="loss">Perdas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary */}
      <BetsSummary bets={filteredBets} />
      
      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="win">Ganhos</TabsTrigger>
          <TabsTrigger value="loss">Perdas</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {filteredBets.length > 0 ? (
            <BetsTable bets={filteredBets} onEdit={handleEditBet} onDelete={handleDeleteBet} />
          ) : (
            <BetsEmptyState onAddBet={handleAddBet} />
          )}
        </TabsContent>
        <TabsContent value="win">
          {filteredBets.filter(bet => bet.resultado === 'GREEN').length > 0 ? (
            <BetsTable bets={filteredBets.filter(bet => bet.resultado === 'GREEN')} onEdit={handleEditBet} onDelete={handleDeleteBet} />
          ) : (
            <BetsEmptyState onAddBet={handleAddBet} />
          )}
        </TabsContent>
        <TabsContent value="loss">
          {filteredBets.filter(bet => bet.resultado === 'RED').length > 0 ? (
            <BetsTable bets={filteredBets.filter(bet => bet.resultado === 'RED')} onEdit={handleEditBet} onDelete={handleDeleteBet} />
          ) : (
            <BetsEmptyState onAddBet={handleAddBet} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bets;
