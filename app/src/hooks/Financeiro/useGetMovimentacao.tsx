import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface MovimentacaoItem {
  codmovimentacao: number;
  descricao: string;
  categoria: string;
  subcategoria: string;
  valor: number;
  datapagamento: string;
  datacadastro?: string;
  // A imagem mostra 'codparcela' como FK opcional, podemos mapear se precisar
  codparcela?: number | null;
}

interface UseGetMovimentacoesProps {
  descricao?: string;
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
}

const useGetMovimentacoes = (filters: UseGetMovimentacoesProps = {}) => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimentacoes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("tbmovimentacao")
        .select("*")
        .order("datapagamento", { ascending: false });

      // Filtros Dinâmicos
      if (filters.descricao) {
        query = query.ilike("descricao", `%${filters.descricao}%`);
      }
      if (filters.categoria) {
        query = query.ilike("categoria", `%${filters.categoria}%`);
      }
      if (filters.dataInicio) {
        query = query.gte("datapagamento", filters.dataInicio);
      }
      if (filters.dataFim) {
        query = query.lte("datapagamento", filters.dataFim);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMovimentacoes(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar movimentações:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    filters.descricao,
    filters.categoria,
    filters.dataInicio,
    filters.dataFim,
  ]);

  useEffect(() => {
    fetchMovimentacoes();
  }, [fetchMovimentacoes]);

  return { movimentacoes, loading, error, refetch: fetchMovimentacoes };
};

export default useGetMovimentacoes;
