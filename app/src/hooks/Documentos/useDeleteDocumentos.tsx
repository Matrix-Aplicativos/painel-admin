import { useState } from "react";
import { supabase } from "@/app/src/lib/supabaseClient";

export default function useDeleteDocumento() {
  const [loading, setLoading] = useState(false);

  const deleteDocumento = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tbdocumento")
        .delete()
        .eq("coddocumento", id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      alert("Erro ao excluir o documento.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDocumento, loading };
}
