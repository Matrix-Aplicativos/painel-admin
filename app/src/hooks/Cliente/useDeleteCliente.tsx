import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const useDeleteCliente = () => {
  const [loading, setLoading] = useState(false);

  const deleteCliente = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tbcliente")
        .delete()
        .eq("codcliente", id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error(err);
      alert("Erro ao excluir cliente: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCliente, loading };
};

export default useDeleteCliente;
