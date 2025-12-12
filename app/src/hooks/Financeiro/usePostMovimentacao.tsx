import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface MovimentacaoPayload {
  codmovimentacao?: number | null;
  descricao: string;
  categoria: string;
  subcategoria: string;
  valor: number;
  datapagamento: string;
  // codparcela?: number | null; // Se precisar vincular a parcela futuramente
}

const usePostMovimentacao = () => {
  const [loading, setLoading] = useState(false);

  const saveMovimentacao = async (data: MovimentacaoPayload) => {
    setLoading(true);
    try {
      if (data.codmovimentacao) {
        // UPDATE
        const { error } = await supabase
          .from("tbmovimentacao")
          .update({
            descricao: data.descricao,
            categoria: data.categoria,
            subcategoria: data.subcategoria,
            valor: data.valor,
            datapagamento: data.datapagamento,
            dataultimaalteracao: new Date().toISOString(),
          })
          .eq("codmovimentacao", data.codmovimentacao);

        if (error) throw error;
      } else {
        // INSERT
        const { codmovimentacao, ...payload } = data;
        const { error } = await supabase.from("tbmovimentacao").insert({
          ...payload,
          datacadastro: new Date().toISOString(),
          dataultimaalteracao: new Date().toISOString(),
        });

        if (error) throw error;
      }
      return true;
    } catch (err: any) {
      console.error("Erro ao salvar movimentação:", err.message);
      alert("Erro ao salvar movimentação: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveMovimentacao, loading };
};

export default usePostMovimentacao;
