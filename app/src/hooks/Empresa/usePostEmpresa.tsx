import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface EmpresaPayload {
  codEmpresa: number | null;
  codIntegracao: number;
  codEmpresaErp: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  bairro: string;
  codMunicipioIbge: string;
  acessoColeta: boolean;
  acessoFv: boolean;
  maxDispositivosColeta: number;
  maxDispositivosMultiColeta: number;
  validadeLicencaColeta: string;
  maxDispositivosFv: number;
  maxDispositivosMultiFv: number;
  validadeLicencaFv: string;
  ativo: boolean;
}

interface UsePostEmpresaResult {
  createEmpresa: (data: EmpresaPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostEmpresa = (): UsePostEmpresaResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createEmpresa = useCallback(async (data: EmpresaPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post("/empresa", data);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível salvar a empresa.";
      setError(errorMessage);
      console.error("Erro ao salvar empresa:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createEmpresa, loading, error, success };
};

export default usePostEmpresa;
