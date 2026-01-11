import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface VersaoMovixPayload {
  codVersao: number | null;
  stringVersao: string;
  atualizacaoObrigatoria: boolean;
  changelog: string;
  plataforma: string;
}

interface UsePostVersaoMovixResult {
  saveVersao: (data: VersaoMovixPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostVersaoMovix = (): UsePostVersaoMovixResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveVersao = useCallback(async (data: VersaoMovixPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post("/versao-movix", data);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao salvar versão.";
      setError(msg);
      console.error("Erro ao salvar versão:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveVersao, loading, error, success };
};

export default usePostVersaoMovix;
