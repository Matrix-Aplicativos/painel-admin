import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

interface UseDeleteUsuarioResult {
  deleteUsuario: (codUsuario: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const useDeleteUsuario = (): UseDeleteUsuarioResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteUsuario = useCallback(async (codUsuario: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.delete(`/usuario/${codUsuario}`);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível excluir o usuário.";
      setError(errorMessage);
      console.error("Erro ao excluir usuário:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUsuario, loading, error, success };
};

export default useDeleteUsuario;
