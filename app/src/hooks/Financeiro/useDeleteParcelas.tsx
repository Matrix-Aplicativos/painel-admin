import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const useDeleteParcela = () => {
  const [loading, setLoading] = useState(false);

  const deleteParcela = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tbparcela")
        .delete()
        .eq("codparcela", id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error(err);
      alert("Erro ao excluir parcela.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteParcela, loading };
};

export default useDeleteParcela;
