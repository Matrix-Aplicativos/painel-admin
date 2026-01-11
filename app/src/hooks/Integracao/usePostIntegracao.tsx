import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface IntegracaoUsuario {
  nomeUsuario: string;
  senha?: string;
}

export interface IntegracaoPayload {
  codIntegracao: number | null;
  descricao: string;
  cnpj: string;
  maxEmpresas: number;
  usuario: IntegracaoUsuario;
  ativo: boolean;
}

interface UsePostIntegracaoResult {
  createIntegracao: (data: IntegracaoPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostIntegracao = (): UsePostIntegracaoResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createIntegracao = useCallback(async (data: IntegracaoPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post("/integracao", data);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível salvar a integração.";
      setError(errorMessage);
      console.error("Erro ao salvar integração:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createIntegracao, loading, error, success };
};

export default usePostIntegracao;
