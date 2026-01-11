import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface Municipio {
  codMunicipioIbge: string;
  uf: string;
  nome: string;
}

export interface EmpresaDetalhe {
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

interface UseGetEmpresaByIdResult {
  empresa: EmpresaDetalhe | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetEmpresaById = (
  codEmpresa: number | undefined
): UseGetEmpresaByIdResult => {
  const [empresa, setEmpresa] = useState<EmpresaDetalhe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresa = useCallback(async () => {
    if (!codEmpresa || codEmpresa <= 0) {
      setEmpresa(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<EmpresaDetalhe>(
        `/empresa/${codEmpresa}`
      );
      setEmpresa(response.data);
    } catch (err) {
      setError("Não foi possível carregar os detalhes da empresa.");
      console.error("Erro ao buscar detalhes da empresa:", err);
      setEmpresa(null);
    } finally {
      setLoading(false);
    }
  }, [codEmpresa]);

  useEffect(() => {
    fetchEmpresa();
  }, [fetchEmpresa]);

  return { empresa, loading, error, refetch: fetchEmpresa };
};

export default useGetEmpresaById;
