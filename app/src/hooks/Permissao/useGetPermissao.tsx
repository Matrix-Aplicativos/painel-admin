import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface PermissaoParams {
  pagina?: number;
  porPagina?: number;
  direction?: string;
  orderBy?: string;
  nome?: string;
}

export interface PermissaoItem {
  codPermissao: number;
  nome: string;
  descricao: string;
}

export interface PermissaoResponse {
  conteudo: PermissaoItem[];
  paginaAtual: number;
  qtdPaginas: number;
  qtdElementos: number;
}

interface UseGetPermissaoResult {
  permissoes: PermissaoItem[];
  pagination: Omit<PermissaoResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetPermissao = (params: PermissaoParams): UseGetPermissaoResult => {
  const [permissoes, setPermissoes] = useState<PermissaoItem[]>([]);
  const [pagination, setPagination] = useState<Omit<
    PermissaoResponse,
    "conteudo"
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissoes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<PermissaoResponse>(
        "/permissao",
        {
          params: {
            pagina: params.pagina || 1,
            porPagina: params.porPagina || 20,
            direction: params.direction || "desc",
            orderBy: params.orderBy || "codPermissao",
            nome: params.nome,
          },
        }
      );

      setPermissoes(response.data.conteudo || []);

      setPagination({
        paginaAtual: response.data.paginaAtual,
        qtdPaginas: response.data.qtdPaginas,
        qtdElementos: response.data.qtdElementos,
      });
    } catch (err) {
      setError("Não foi possível carregar as permissões.");
      console.error("Erro ao buscar permissões:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.pagina,
    params.porPagina,
    params.direction,
    params.orderBy,
    params.nome,
  ]);

  useEffect(() => {
    fetchPermissoes();
  }, [fetchPermissoes]);

  return { permissoes, pagination, loading, error, refetch: fetchPermissoes };
};

export default useGetPermissao;
