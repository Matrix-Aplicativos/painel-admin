import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface ConfigUpdatePayload {
  valor: string;
  ativo: boolean;
}

interface UsePutConfigResult {
  updateConfig: (
    codConfiguracao: number,
    data: ConfigUpdatePayload
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePutConfigMovix = (): UsePutConfigResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateConfig = useCallback(
    async (codConfiguracao: number, data: ConfigUpdatePayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        // Caminho: /configuracao/movix/{codConfiguracao}
        await axiosInstance.put(`/configuracao/movix/${codConfiguracao}`, data);

        setSuccess(true);
        return true;
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          "Erro ao atualizar configuração MOVIX.";
        setError(msg);
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateConfig, loading, error, success };
};

export default usePutConfigMovix;
