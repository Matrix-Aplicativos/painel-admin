import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

interface UseDeleteUsuarioEmpresaResult {
  desvincularUsuarioEmpresa: (
    codUsuario: number,
    codEmpresa: number
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const useDeleteUsuarioEmpresa = (): UseDeleteUsuarioEmpresaResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const desvincularUsuarioEmpresa = useCallback(
    async (codUsuario: number, codEmpresa: number) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await axiosInstance.delete(
          `/usuario/usuario-empresa/${codUsuario}/${codEmpresa}`
        );
        setSuccess(true);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          "Não foi possível desvincular a empresa.";
        setError(errorMessage);
        console.error("Erro ao desvincular usuário-empresa:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { desvincularUsuarioEmpresa, loading, error, success };
};

export default useDeleteUsuarioEmpresa;
