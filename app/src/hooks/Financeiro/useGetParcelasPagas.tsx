import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/src/lib/supabaseClient";

export interface ParcelaPagaItem {
  codparcela: number;
  codcliente: number;
  numparcela: number;
  valor: number;
  datavencimento: string;
  tipo: string;
  pago: boolean;
  datapagamento?: string | null;
  tbcliente?: { razaosocial: string };
}

interface FiltrosProps {
  dataInicio?: string;
  dataFim?: string;
}

const useGetParcelasPagas = (filtros: FiltrosProps) => {
  const [parcelas, setParcelas] = useState<ParcelaPagaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParcelas = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("tbparcela") 
        .select(
          `
          *,
          tbcliente (
            razaosocial
          )
        `
        )
        .eq("pago", true); 

      if (filtros.dataInicio) {
        query = query.gte("datapagamento", filtros.dataInicio);
      }
      if (filtros.dataFim) {
        query = query.lte("datapagamento", filtros.dataFim);
      }

      const { data, error } = await query.order("datapagamento", {
        ascending: false,
      });

      if (error) throw error;

      setParcelas((data as unknown as ParcelaPagaItem[]) || []);
    } catch (err) {
      console.error("Erro ao buscar parcelas pagas:", err);
    } finally {
      setLoading(false);
    }
  }, [filtros.dataInicio, filtros.dataFim]);

  useEffect(() => {
    fetchParcelas();
  }, [fetchParcelas]);

  return { parcelas, loading, refetch: fetchParcelas };
};

export default useGetParcelasPagas;
