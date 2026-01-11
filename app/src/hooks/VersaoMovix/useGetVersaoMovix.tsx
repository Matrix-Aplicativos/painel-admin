import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface VersaoMovixParams {
  pagina?: number;
  porPagina?: number;
  direction?: string;
  orderBy?: string;
  versao?: string;
  plataforma?: string;
}

export interface VersaoMovixItem {
  codVersao: number;
  stringVersao: string;
  atualizacaoObrigatoria: boolean;
  changelog: string;
  plataforma: string;
  dataCadastro: string;
}

export interface VersaoMovixResponse {
  conteudo: VersaoMovixItem[];
  paginaAtual: number;
  qtdPaginas: number;
  qtdElementos: number;
}

interface UseGetVersaoMovixResult {
  versoes: VersaoMovixItem[];
  pagination: Omit<VersaoMovixResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetVersaoMovix = (
  params: VersaoMovixParams
): UseGetVersaoMovixResult => {
  const [versoes, setVersoes] = useState<VersaoMovixItem[]>([]);
  const [pagination, setPagination] = useState<Omit<
    VersaoMovixResponse,
    "conteudo"
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVersoes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<VersaoMovixResponse>(
        "/versao-movix",
        {
          params: {
            pagina: params.pagina || 1,
            porPagina: params.porPagina || 20,
            direction: params.direction || "desc",
            orderBy: params.orderBy || "dataCadastro",
            versao: params.versao,
            plataforma: params.plataforma,
          },
        }
      );

      setVersoes(response.data.conteudo || []);

      setPagination({
        paginaAtual: response.data.paginaAtual,
        qtdPaginas: response.data.qtdPaginas,
        qtdElementos: response.data.qtdElementos,
      });
    } catch (err) {
      setError("Não foi possível carregar as versões.");
      console.error("Erro ao buscar versões:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.pagina,
    params.porPagina,
    params.direction,
    params.orderBy,
    params.versao,
    params.plataforma,
  ]);

  useEffect(() => {
    fetchVersoes();
  }, [fetchVersoes]);

  return { versoes, pagination, loading, error, refetch: fetchVersoes };
};

export default useGetVersaoMovix;
