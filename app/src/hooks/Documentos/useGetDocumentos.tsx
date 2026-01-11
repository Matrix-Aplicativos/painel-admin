import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/src/lib/supabaseClient";
import { hexToBlob } from "@/app/src/utils/fileConverters";

export interface DocumentoItem {
  coddocumento: number;
  nome: string;
  datacadastro: string;
}

const useGetDocumentos = () => {
  const [documentos, setDocumentos] = useState<DocumentoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocumentos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tbdocumento")
        .select("coddocumento, nome, datacadastro")
        .order("datacadastro", { ascending: false });

      if (error) throw error;
      setDocumentos((data as any[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const openDocumento = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from("tbdocumento")
        .select("arquivo")
        .eq("coddocumento", id)
        .single();

      if (error) throw error;
      if (!data || !data.arquivo) throw new Error("Arquivo vazio");

      const blob = hexToBlob(data.arquivo, "application/pdf");
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Erro ao abrir o arquivo.");
    }
  };

  return {
    documenti: documentos,
    loading,
    refetch: fetchDocumentos,
    openDocumento,
  };
};

export default useGetDocumentos;
