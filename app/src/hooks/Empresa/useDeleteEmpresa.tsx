import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

interface UseDeleteEmpresaResult {
  deleteEmpresa: (codEmpresa: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const useDeleteEmpresa = (): UseDeleteEmpresaResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteEmpresa = useCallback(async (codEmpresa: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.delete(`/empresa/${codEmpresa}`);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível excluir a empresa.";
      setError(errorMessage);
      console.error("Erro ao excluir empresa:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteEmpresa, loading, error, success };
};

export default useDeleteEmpresa;
