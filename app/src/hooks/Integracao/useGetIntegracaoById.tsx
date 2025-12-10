import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface Responsavel {
  codUsuarioIntegracao: number;
  nome: string;
  login: string;
  ativo: boolean;
}

export interface IntegracaoDetalhe {
  codIntegracao: number;
  descricao: string;
  maxEmpresas: number;
  responsavel: Responsavel;
  ativo: boolean;
}

interface UseGetIntegracaoByIdResult {
  integracao: IntegracaoDetalhe | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetIntegracaoById = (
  codIntegracao: number | undefined
): UseGetIntegracaoByIdResult => {
  const [integracao, setIntegracao] = useState<IntegracaoDetalhe | null>(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const fetchIntegracao = useCallback(async () => {
    if (!codIntegracao || codIntegracao <= 0) {
      setIntegracao(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<IntegracaoDetalhe>(
        `/integracao/${codIntegracao}`
      );
      setIntegracao(response.data);
    } catch (err) {
      setError("Não foi possível carregar os detalhes da integração.");
      console.error("Erro ao buscar detalhes da integração:", err);
      setIntegracao(null);
    } finally {
      setLoading(false);
    }
  }, [codIntegracao]);

  useEffect(() => {
    fetchIntegracao();
  }, [fetchIntegracao]);

  return { integracao, loading, error, refetch: fetchIntegracao };
};

export default useGetIntegracaoById;
