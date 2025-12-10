import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

interface UseDeleteVersaoMovixResult {
  deleteVersao: (codVersao: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const useDeleteVersaoMovix = (): UseDeleteVersaoMovixResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteVersao = useCallback(async (codVersao: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.delete(`/versao-movix/${codVersao}`);
      setSuccess(true);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao excluir versão.";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteVersao, loading, error, success };
};

export default useDeleteVersaoMovix;
