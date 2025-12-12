import { useState, useEffect, useCallback } from "react";
import { Municipio } from "./useGetUsuario";
import axiosInstance from "../axiosInstance";

// Interfaces de Permissão e Cargo
export interface Permissao {
  codPermissao: number;
  nome: string;
  descricao: string;
}

export interface CargoUsuario {
  codCargo: number;
  nome: string;
  permissoes: Permissao[];
}

// Interface da Empresa dentro do detalhe do usuário
export interface EmpresaUsuarioDetalhe {
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

// Interface do Usuário Detalhado
export interface UsuarioDetalhe {
  codUsuario: number;
  nome: string;
  email: string;
  login: string;
  ativo: boolean;
  primeiroAcesso: boolean;
  cargos: CargoUsuario[]; // Nova lista de cargos
  empresas: EmpresaUsuarioDetalhe[];
}

interface UseGetUsuarioByIdResult {
  usuario: UsuarioDetalhe | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetUsuarioById = (
  codUsuario: number | null | undefined
): UseGetUsuarioByIdResult => {
  const [usuario, setUsuario] = useState<UsuarioDetalhe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuario = useCallback(async () => {
    if (!codUsuario || codUsuario <= 0) {
      setUsuario(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<UsuarioDetalhe>(
        `/usuario/${codUsuario}`
      );
      setUsuario(response.data);
    } catch (err: any) {
      setError("Não foi possível carregar os detalhes do usuário.");
      console.error("Erro ao buscar usuário:", err);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, [codUsuario]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  return { usuario, loading, error, refetch: fetchUsuario };
};

export default useGetUsuarioById;
