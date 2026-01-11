import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface EmpresaParams {
  codIntegracao?: number;
  pagina?: number;
  porPagina?: number;
  direction?: string;
  orderBy?: string;
  razaoSocial?: string;
  cnpj?: string;
  cidade?: string;
}

export interface Municipio {
  codMunicipioIbge: string;
  uf: string;
  nome: string;
}

export interface EmpresaItem {
  codEmpresa: number;
  codIntegracao: number;
  codEmpresaErp: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  bairro: string;
  municipio: Municipio;
  acessoColeta: boolean;
  acessoFdv: boolean;
  maxDispositivosColeta: number;
  maxDispositivosMultiColeta: number;
  validadeLicencaColeta: string;
  maxDispositivosFdv: number;
  maxDispositivosMultiFdv: number;
  validadeLicencaFdv: string;
  diaVencimentoBoletoColeta: number;
  diaVencimentoBoletoFdv: number;
  ativo: boolean;
}

export interface EmpresaResponse {
  conteudo: EmpresaItem[];
  paginaAtual: number;
  qtdPaginas: number;
  qtdElementos: number;
}

interface UseGetEmpresaResult {
  empresas: EmpresaItem[];
  pagination: Omit<EmpresaResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetEmpresa = (params: EmpresaParams): UseGetEmpresaResult => {
  const [empresas, setEmpresas] = useState<EmpresaItem[]>([]);
  const [pagination, setPagination] = useState<Omit<
    EmpresaResponse,
    "conteudo"
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<EmpresaResponse>("/empresa", {
        params: {
          codIntegracao: params.codIntegracao,
          pagina: params.pagina || 1,
          porPagina: params.porPagina || 10,
          direction: params.direction || "desc",
          orderBy: params.orderBy || "codEmpresa",
          razaoSocial: params.razaoSocial,
          cnpj: params.cnpj,
          cidade: params.cidade,
        },
      });

      setEmpresas(response.data.conteudo || []);

      setPagination({
        paginaAtual: response.data.paginaAtual,
        qtdPaginas: response.data.qtdPaginas,
        qtdElementos: response.data.qtdElementos,
      });
    } catch (err) {
      setError("Não foi possível carregar as empresas.");
      console.error("Erro ao buscar empresas:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.codIntegracao,
    params.pagina,
    params.porPagina,
    params.direction,
    params.orderBy,
    params.razaoSocial,
    params.cnpj,
    params.cidade,
  ]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  return { empresas, pagination, loading, error, refetch: fetchEmpresas };
};

export default useGetEmpresa;
