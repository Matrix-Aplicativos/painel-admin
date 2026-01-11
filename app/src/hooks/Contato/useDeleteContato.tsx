import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const useDeleteContato = () => {
  const [loading, setLoading] = useState(false);

  const deleteContato = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tbcontatocliente")
        .delete()
        .eq("codcontatocliente", id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error(err);
      alert("Erro ao excluir contato.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteContato, loading };
};

export default useDeleteContato;
