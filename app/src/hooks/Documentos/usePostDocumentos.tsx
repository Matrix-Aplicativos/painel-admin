import { useState } from "react";
import { supabase } from "@/app/src/lib/supabaseClient";
import { fileToHex } from "@/app/src/utils/fileConverters";

export default function usePostDocumento() {
  const [loading, setLoading] = useState(false);

  const saveDocumento = async (nome: string, arquivo: File) => {
    setLoading(true);
    try {
      const hexArquivo = await fileToHex(arquivo);

      const { error } = await supabase.from("tbdocumento").insert([
        {
          nome: nome, 
          arquivo: hexArquivo, 
        },
      ]);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
      alert(
        "Erro ao salvar documento. Verifique se a tabela 'tbdocumento' existe."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveDocumento, loading };
}
