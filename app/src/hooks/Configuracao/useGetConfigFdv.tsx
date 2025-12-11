import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";
import { ConfigParams, ConfigResponse, ConfigItem } from "./useGetConfigMovix";

interface UseGetConfigResult {
  configuracoes: ConfigItem[];
  pagination: Omit<ConfigResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetConfigFdv = (params: ConfigParams): UseGetConfigResult => {
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
        `/configuracao/fdv/${params.codEmpresa}`,
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
      setError("Erro ao carregar configurações FDV.");
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

export default useGetConfigFdv;
