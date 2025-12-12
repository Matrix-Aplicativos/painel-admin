import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const useDeleteMovimentacao = () => {
  const [loading, setLoading] = useState(false);

  const deleteMovimentacao = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tbmovimentacao")
        .delete()
        .eq("codmovimentacao", id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error("Erro ao excluir movimentação:", err.message);
      alert("Erro ao excluir: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteMovimentacao, loading };
};

export default useDeleteMovimentacao;
