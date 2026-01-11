import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface CargoParams {
  pagina?: number;
  porPagina?: number;
  direction?: string;
  orderBy?: string;
  nome?: string;
}

export interface PermissaoCargo {
  codPermissao: number;
  nome: string;
  descricao: string;
}

export interface CargoItem {
  codCargo: number;
  nome: string;
  permissoes: PermissaoCargo[];
}

export interface CargoResponse {
  conteudo: CargoItem[];
  paginaAtual: number;
  qtdPaginas: number;
  qtdElementos: number;
}

interface UseGetCargoResult {
  cargos: CargoItem[];
  pagination: Omit<CargoResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetCargo = (params: CargoParams): UseGetCargoResult => {
  const [cargos, setCargos] = useState<CargoItem[]>([]);
  const [pagination, setPagination] = useState<Omit<
    CargoResponse,
    "conteudo"
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCargos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<CargoResponse>("/cargo", {
        params: {
          pagina: params.pagina || 1,
          porPagina: params.porPagina || 20,
          direction: params.direction || "desc",
          orderBy: params.orderBy || "codCargo", 
          nome: params.nome,
        },
      });

      setCargos(response.data.conteudo || []);

      setPagination({
        paginaAtual: response.data.paginaAtual,
        qtdPaginas: response.data.qtdPaginas,
        qtdElementos: response.data.qtdElementos,
      });
    } catch (err) {
      setError("Não foi possível carregar os cargos.");
      console.error("Erro ao buscar cargos:", err);
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
    fetchCargos();
  }, [fetchCargos]);

  return { cargos, pagination, loading, error, refetch: fetchCargos };
};

export default useGetCargo;
