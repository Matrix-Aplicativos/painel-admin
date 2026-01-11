import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface MunicipioParams {
  pagina?: number;
  porPagina?: number;
  nome?: string;
  uf?: string;
}

export interface MunicipioItem {
  codMunicipioIbge: string;
  uf: string;
  nome: string;
}

export interface MunicipioResponse {
  conteudo: MunicipioItem[];
  paginaAtual: number;
  qtdPaginas: number;
  qtdElementos: number;
}

interface UseGetMunicipioResult {
  municipios: MunicipioItem[];
  pagination: Omit<MunicipioResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetMunicipio = (params: MunicipioParams): UseGetMunicipioResult => {
  const [municipios, setMunicipios] = useState<MunicipioItem[]>([]);
  const [pagination, setPagination] = useState<Omit<
    MunicipioResponse,
    "conteudo"
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMunicipios = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<MunicipioResponse>(
        "/municipio",
        {
          params: {
            pagina: params.pagina || 1,
            porPagina: params.porPagina || 20,
            nome: params.nome,
            uf: params.uf,
          },
        }
      );

      setMunicipios(response.data.conteudo || []);

      setPagination({
        paginaAtual: response.data.paginaAtual,
        qtdPaginas: response.data.qtdPaginas,
        qtdElementos: response.data.qtdElementos,
      });
    } catch (err) {
      setError("Não foi possível carregar os municípios.");
      console.error("Erro ao buscar municípios:", err);
    } finally {
      setLoading(false);
    }
  }, [params.pagina, params.porPagina, params.nome, params.uf]);

  useEffect(() => {
    fetchMunicipios();
  }, [fetchMunicipios]);

  return { municipios, pagination, loading, error, refetch: fetchMunicipios };
};

export default useGetMunicipio;
