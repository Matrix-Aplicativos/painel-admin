import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

interface ResetSenhaRequest {
  login: string;
  senha: string;
  primeiroAcesso: boolean;
}

interface UsePostResetarSenhaResult {
  resetarSenha: (login: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostResetarSenha = (): UsePostResetarSenhaResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetarSenha = useCallback(async (login: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const senhaGerada = login.substring(0, 3);

      const payload: ResetSenhaRequest = {
        login: login,
        senha: senhaGerada,
        primeiroAcesso: true,
      };

      await axiosInstance.post("/usuario/resetar-senha", payload);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível resetar a senha.";
      setError(errorMessage);
      console.error("Erro ao resetar senha:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resetarSenha, loading, error, success };
};

export default usePostResetarSenha;
