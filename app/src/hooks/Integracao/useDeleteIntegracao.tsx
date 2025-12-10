import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

interface UseDeleteIntegracaoResult {
  deleteIntegracao: (codIntegracao: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const useDeleteIntegracao = (): UseDeleteIntegracaoResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteIntegracao = useCallback(async (codIntegracao: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.delete(`/integracao/${codIntegracao}`);

      setSuccess(true);
      return true; 
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível excluir a integração.";
      setError(errorMessage);
      console.error("Erro ao excluir integração:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteIntegracao, loading, error, success };
};

export default useDeleteIntegracao;
