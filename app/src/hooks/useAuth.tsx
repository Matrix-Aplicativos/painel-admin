import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "./axiosInstance";

interface LoginRequest {
  login: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  dataCriacao: string;
  dataExpiracao: string;
  primeiroAcesso: boolean;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const login = async ({ login, senha }: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        {
          login,
          senha,
        }
      );

      const data = response.data;

      if (data.token) {
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("refresh_token", data.refreshToken);

        return {
          success: true,
          primeiroAcesso: data.primeiroAcesso,
        };
      }

      return { success: false, primeiroAcesso: false };
    } catch (err: any) {
      console.error("Erro no login:", err);
      const msg =
        err.response?.data?.message ||
        "Falha ao autenticar. Verifique login e senha.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  return {
    login,
    logout,
    loading,
    error,
  };
};
