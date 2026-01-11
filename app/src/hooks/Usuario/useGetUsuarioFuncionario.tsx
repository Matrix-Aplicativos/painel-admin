import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface FuncionarioUsuarioItem {
  codFuncionario: number;
  codIntegracao: number;
  codEmpresa: number;
  codFuncionarioErp: string;
  nome: string;
  cpf: string;
  email: string;
  ativo: boolean;
}

interface UseGetFuncionarioUsuarioResult {
  funcionarios: FuncionarioUsuarioItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetFuncionarioUsuario = (
  codUsuario: number | undefined,
  codEmpresa: number | undefined
): UseGetFuncionarioUsuarioResult => {
  const [funcionarios, setFuncionarios] = useState<FuncionarioUsuarioItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuncionarios = useCallback(async () => {
    if (!codUsuario || !codEmpresa) {
      setFuncionarios([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<FuncionarioUsuarioItem[]>(
        `/usuario/funcionario/${codUsuario}/${codEmpresa}`
      );
      setFuncionarios(response.data);
    } catch (err: any) {
      setError("Não foi possível carregar os funcionários.");
      console.error("Erro ao buscar funcionários do usuário:", err);
      setFuncionarios([]);
    } finally {
      setLoading(false);
    }
  }, [codUsuario, codEmpresa]);

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  return { funcionarios, loading, error, refetch: fetchFuncionarios };
};

export default useGetFuncionarioUsuario;
