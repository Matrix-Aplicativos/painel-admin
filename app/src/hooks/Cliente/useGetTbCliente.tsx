import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface TbClienteItem {
  codcliente: number;
  razaosocial: string;
  cnpj: string;
  situacao: string;
  endereco?: string;
  cep?: string;
  observacoes?: string;
  datacadastro?: string;
  dataultimaalteracao?: string;
}

interface UseGetTbClienteProps {
  razaoSocial?: string;
  cnpj?: string;
}

const useGetTbCliente = ({ razaoSocial, cnpj }: UseGetTbClienteProps = {}) => {
  const [data, setData] = useState<TbClienteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("tbcliente").select("*");

      if (razaoSocial) {
        query = query.ilike("razaosocial", `%${razaoSocial}%`);
      }

      if (cnpj) {
        query = query.ilike("cnpj", `%${cnpj}%`);
      }

      const { data: result, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      setData(result || []);
    } catch (err: any) {
      console.error("Erro ao buscar clientes:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [razaoSocial, cnpj]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { clientes: data, loading, error, refetch: fetchData };
};

export default useGetTbCliente;
