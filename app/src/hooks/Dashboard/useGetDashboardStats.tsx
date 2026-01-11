import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/src/lib/supabaseClient";

export interface DashboardStats {
  totalClientes: number;
  faturamentoHoje: number;
  novasIntegracoes: number;
  vencimentosHoje: number;
}

export default function useGetDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    faturamentoHoje: 0,
    novasIntegracoes: 0,
    vencimentosHoje: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const hoje = new Date().toISOString().split("T")[0]; 

      const { count: countClientes } = await supabase
        .from("tbcliente")
        .select("*", { count: "exact", head: true });

      const { count: countIntegracoes } = await supabase
        .from("tbcliente")
        .select("*", { count: "exact", head: true })
        .not("codintegracaoapi", "is", null);

      const { count: countVencimentos } = await supabase
        .from("tbparcela")
        .select("*", { count: "exact", head: true })
        .eq("pago", false)
        .eq("datavencimento", hoje);

      const { data: movData } = await supabase
        .from("tbmovimentacao")
        .select("valor")
        .eq("datapagamento", hoje);

      const totalFaturamento =
        movData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0;

      setStats({
        totalClientes: countClientes || 0,
        novasIntegracoes: countIntegracoes || 0,
        vencimentosHoje: countVencimentos || 0,
        faturamentoHoje: totalFaturamento,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
