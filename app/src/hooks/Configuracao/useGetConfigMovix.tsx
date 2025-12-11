import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface ConfigParams {
  codEmpresa: number; 
  pagina?: number;
  porPagina?: number;
  direction?: string;
  orderBy?: string;
  codConfiguracao?: number;
  descricao?: string;
}

export interface ConfigItem {
  codConfiguracao: number;
  codEmpresa: number;
  descricao: string;
  valor: string;
  ativo: boolean;
}

export interface ConfigResponse {
  conteudo: ConfigItem[];
  paginaAtual: number;
  qtdPaginas: number;
  qtdElementos: number;
}

interface UseGetConfigResult {
  configuracoes: ConfigItem[];
  pagination: Omit<ConfigResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetConfigMovix = (params: ConfigParams): UseGetConfigResult => {
  const [configuracoes, setConfiguracoes] = useState<ConfigItem[]>([]);
  const [pagination, setPagination] = useState<Omit<
    ConfigResponse,
    "conteudo"
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!params.codEmpresa) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<ConfigResponse>(
        `/configuracao/movix/${params.codEmpresa}`,
        {
          params: {
            pagina: params.pagina || 1,
            porPagina: params.porPagina || 10,
            direction: params.direction || "desc",
            orderBy: params.orderBy || "codConfiguracao",
            codConfiguracao: params.codConfiguracao,
            descricao: params.descricao,
          },
        }
      );

      setConfiguracoes(response.data.conteudo || []);
      setPagination({
        paginaAtual: response.data.paginaAtual,
        qtdPaginas: response.data.qtdPaginas,
        qtdElementos: response.data.qtdElementos,
      });
    } catch (err: any) {
      setError("Erro ao carregar configurações MOVIX.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    params.codEmpresa,
    params.pagina,
    params.porPagina,
    params.direction,
    params.orderBy,
    params.codConfiguracao,
    params.descricao,
  ]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { configuracoes, pagination, loading, error, refetch: fetchConfig };
};

export default useGetConfigMovix;
