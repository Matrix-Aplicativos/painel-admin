import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface UsuarioPayload {
  codUsuario: number;
  nome: string;
  email: string;
  login: string;
  primeiroAcesso: boolean;
  ativo: boolean;
}

interface UsePostUsuarioResult {
  createUsuario: (data: UsuarioPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostUsuario = (): UsePostUsuarioResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createUsuario = useCallback(async (data: UsuarioPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post("/usuario", data);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível salvar o usuário.";
      setError(errorMessage);
      console.error("Erro ao salvar usuário:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUsuario, loading, error, success };
};

export default usePostUsuario;
