import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface IntegracaoParams {
  pagina?: number;
  porPagina?: number;
  direction?: string;
  orderBy?: string;
  descricao?: string;
  cnpj?: string;
}

export interface IntegracaoItem {
  codIntegracao: number;
  descricao: string;
  cnpj: string;
}

interface UseGetIntegracaoResult {
  integracoes: IntegracaoItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void; 
}

const useGetIntegracao = (params: IntegracaoParams): UseGetIntegracaoResult => {
  const [integracoes, setIntegracoes] = useState<IntegracaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegracoes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<IntegracaoItem[]>(
        "/integracao",
        {
          params: {
            pagina: params.pagina || 1, 
            porPagina: params.porPagina || 20, 
            direction: params.direction || "desc", 
            orderBy: params.orderBy || "codIntegracao", 
            descricao: params.descricao,
            cnpj: params.cnpj,
          },
        }
      );
      setIntegracoes(response.data || []);
    } catch (err) {
      setError("Não foi possível carregar as integrações.");
      console.error("Erro ao buscar integrações:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.pagina,
    params.porPagina,
    params.direction,
    params.orderBy,
    params.descricao,
    params.cnpj,
  ]);

  useEffect(() => {
    fetchIntegracoes();
  }, [fetchIntegracoes]);

  return { integracoes, loading, error, refetch: fetchIntegracoes };
};

export default useGetIntegracao;
