import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface ContatoItem {
  codcontatocliente: number;
  codcliente: number;
  nome: string;
  email: string;
  telefone: string;
}

const useGetContatos = (codCliente: number) => {
  const [contatos, setContatos] = useState<ContatoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContatos = useCallback(async () => {
    if (!codCliente) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tbcontatocliente")
        .select("*")
        .eq("codcliente", codCliente)
        .order("nome", { ascending: true });

      if (error) throw error;
      setContatos(data || []);
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
    } finally {
      setLoading(false);
    }
  }, [codCliente]);

  useEffect(() => {
    fetchContatos();
  }, [fetchContatos]);

  return { contatos, loading, refetch: fetchContatos };
};

export default useGetContatos;
