import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface ParcelaPayload {
  codparcela?: number | null;
  codcliente: number;
  numparcela: number;
  valor: number;
  datavencimento: string; // Espera YYYY-MM-DD do front ou convertemos
  tipo: string;
  pago: boolean;
  datapagamento?: string | null;
}

const usePostParcela = () => {
  const [loading, setLoading] = useState(false);

  const saveParcela = async (data: ParcelaPayload) => {
    setLoading(true);
    try {
      if (data.codparcela) {
        // UPDATE
        const { error } = await supabase
          .from("tbparcela")
          .update({
            numparcela: data.numparcela,
            valor: data.valor,
            datavencimento: data.datavencimento,
            tipo: data.tipo,
            pago: data.pago,
            datapagamento: data.datapagamento || null,
            dataultimaalteracao: new Date().toISOString(),
          })
          .eq("codparcela", data.codparcela);
        if (error) throw error;
      } else {
        // INSERT
        const { codparcela, ...payload } = data;
        const { error } = await supabase.from("tbparcela").insert({
          ...payload,
          datacadastro: new Date().toISOString(),
          dataultimaalteracao: new Date().toISOString(),
        });
        if (error) throw error;
      }
      return true;
    } catch (err: any) {
      console.error("Erro ao salvar parcela:", err.message);
      alert("Erro ao salvar parcela.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveParcela, loading };
};

export default usePostParcela;
