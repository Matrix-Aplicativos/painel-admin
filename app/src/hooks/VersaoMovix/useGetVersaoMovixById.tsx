import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface VersaoMovixDetalhe {
  codVersao: number;
  stringVersao: string;
  atualizacaoObrigatoria: boolean;
  changelog: string;
  plataforma: string;
  dataCadastro: string;
}

interface UseGetVersaoMovixByIdResult {
  versao: VersaoMovixDetalhe | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetVersaoMovixById = (
  codVersao: number | null
): UseGetVersaoMovixByIdResult => {
  const [versao, setVersao] = useState<VersaoMovixDetalhe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersao = useCallback(async () => {
    if (!codVersao) return; 

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<VersaoMovixDetalhe>(
        `/versao-movix/${codVersao}`
      );
      setVersao(response.data);
    } catch (err: any) {
      setError("Não foi possível carregar os detalhes da versão.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [codVersao]);

  useEffect(() => {
    if (codVersao) {
      fetchVersao();
    } else {
      setVersao(null);
    }
  }, [codVersao, fetchVersao]);

  return { versao, loading, error, refetch: fetchVersao };
};

export default useGetVersaoMovixById;
