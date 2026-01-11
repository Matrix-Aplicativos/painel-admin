import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface ParcelaItem {
  codparcela: number;
  codcliente: number;
  numparcela: number;
  valor: number;
  datavencimento: string;
  tipo: string;
  pago: boolean;
  datapagamento?: string | null;
}

const useGetParcelas = (idCliente: number) => {
  const [parcelas, setParcelas] = useState<ParcelaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParcelas = useCallback(async () => {
    if (!idCliente) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tbparcela")
        .select("*")
        .eq("codcliente", idCliente)
        .order("datavencimento", { ascending: true }); // Traz todas para a lista completa

      if (error) throw error;
      setParcelas(data || []);
    } catch (err) {
      console.error("Erro ao buscar parcelas:", err);
    } finally {
      setLoading(false);
    }
  }, [idCliente]);

  useEffect(() => {
    fetchParcelas();
  }, [fetchParcelas]);

  return { parcelas, loading, refetch: fetchParcelas };
};

export default useGetParcelas;
