import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface UsuarioParams {
  pagina?: number;
  porPagina?: number;
  direction?: string;
  orderBy?: string;
  login?: string;
  email?: string;
  nome?: string;
}

export interface Municipio {
  codMunicipioIbge: string;
  uf: string;
  nome: string;
}

export interface EmpresaUsuario {
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
  ativo: boolean;
}

export interface UsuarioItem {
  codUsuario: number;
  nome: string;
  email: string;
  login: string;
  ativo: boolean;
  primeiroAcesso: boolean;
  empresas: EmpresaUsuario[];
}

export interface UsuarioResponse {
  conteudo: UsuarioItem[];
  paginaAtual: number;
  qtdPaginas: number;
  qtdElementos: number;
}

interface UseGetUsuarioResult {
  usuarios: UsuarioItem[];
  pagination: Omit<UsuarioResponse, "conteudo"> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetUsuario = (params: UsuarioParams): UseGetUsuarioResult => {
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [pagination, setPagination] = useState<Omit<
    UsuarioResponse,
    "conteudo"
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<UsuarioResponse>("/usuario", {
        params: {
          pagina: params.pagina || 1,
          porPagina: params.porPagina || 20,
          direction: params.direction || "desc",
          orderBy: params.orderBy || "codUsuario",
          login: params.login,
          email: params.email,
          nome: params.nome,
        },
      });

      setUsuarios(response.data.conteudo || []);

      setPagination({
        paginaAtual: response.data.paginaAtual,
        qtdPaginas: response.data.qtdPaginas,
        qtdElementos: response.data.qtdElementos,
      });
    } catch (err) {
      setError("Não foi possível carregar os usuários.");
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  }, [
    params.pagina,
    params.porPagina,
    params.direction,
    params.orderBy,
    params.login,
    params.email,
    params.nome,
  ]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return { usuarios, pagination, loading, error, refetch: fetchUsuarios };
};

export default useGetUsuario;
