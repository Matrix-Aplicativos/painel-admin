import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/src/lib/supabaseClient";
import { hexToBlob } from "@/app/src/utils/fileConverters"; 

export interface DocumentoItem {
  CodDocumento: number;
  Nome: string;
  DataCadastro: string;
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
      console.error("Erro ao buscar documentos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const downloadDocumento = async (id: number, nomeArquivo: string) => {
    try {
      const { data, error } = await supabase
        .from("tbdocumento")
        .select("arquivo")
        .eq("coddocumento", id)
        .single();

      if (error) throw error;
      if (!data || !data.arquivo)
        throw new Error("Arquivo vazio ou não encontrado.");

      const blob = hexToBlob(data.arquivo, "application/pdf"); 

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nomeArquivo; 
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Erro ao baixar documento:", err);
      alert("Erro ao baixar o arquivo.");
    }
  };

  return {
    documenti: documentos,
    loading,
    refetch: fetchDocumentos,
    downloadDocumento,
  };
};

export default useGetDocumentos;
