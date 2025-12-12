import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface VencimentoItem {
  id: number;
  cliente: string;
  valor: number;
  data: string; // YYYY-MM-DD
  categoria: string; // Tipo da parcela
  status: "pago" | "pendente" | "atrasado";
}

const useGetVencimentos = (month: number, year: number) => {
  const [vencimentos, setVencimentos] = useState<VencimentoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVencimentos = useCallback(async () => {
    setLoading(true);

    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;

    try {
      const { data: parcelas, error } = await supabase
        .from("tbparcela")
        .select(
          `
          codparcela,
          valor,
          datavencimento,
          tipo,
          pago,
          tbcliente ( razaosocial ) 
        `
        ) 
        .gte("datavencimento", startDate)
        .lte("datavencimento", endDate);

      if (error) throw error;

      if (parcelas) {
        const formatados: VencimentoItem[] = parcelas.map((p: any) => {
          const isAtrasado =
            !p.pago &&
            new Date(p.datavencimento) < new Date() &&
            new Date().toISOString().split("T")[0] !== p.datavencimento;

          return {
            id: p.codparcela,
            cliente: p.tbcliente?.razaosocial || "Cliente Desconhecido",
            valor: p.valor,
            data: p.datavencimento,
            categoria: p.tipo,
            status: p.pago ? "pago" : isAtrasado ? "atrasado" : "pendente",
          };
        });
        setVencimentos(formatados);
      }
    } catch (err) {
      console.error("Erro ao buscar vencimentos:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchVencimentos();
  }, [fetchVencimentos]);

  return { vencimentos, loading, refetch: fetchVencimentos };
};

export default useGetVencimentos;
