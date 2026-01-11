import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface CadastroFuncionarioPayload {
  codFuncionario?: number; 
  codEmpresa: number; 
  codFuncionarioErp: string;
  nome: string;
  cpf: string;
  email: string;
  ativo: boolean;
}

export interface UsuarioEmpresaPayload {
  codUsuario?: number;
  codEmpresa: number;
  ativo: boolean;
  cadastroFuncionario: CadastroFuncionarioPayload;
}

interface UsePostUsuarioEmpresaResult {
  vincularUsuarioEmpresa: (data: UsuarioEmpresaPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostUsuarioEmpresa = (): UsePostUsuarioEmpresaResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const vincularUsuarioEmpresa = useCallback(
    async (data: UsuarioEmpresaPayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await axiosInstance.post("/usuario/usuario-empresa", data);
        setSuccess(true);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          "Não foi possível vincular o usuário à empresa.";
        setError(errorMessage);
        console.error("Erro ao vincular usuário-empresa:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { vincularUsuarioEmpresa, loading, error, success };
};

export default usePostUsuarioEmpresa;
