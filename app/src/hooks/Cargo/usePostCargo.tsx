import { useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

export interface CargoPayload {
  nome: string;
  permissoes: number[]; 
}

interface UsePostCargoResult {
  createCargo: (data: CargoPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostCargo = (): UsePostCargoResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createCargo = useCallback(async (data: CargoPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post("/cargo", data);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Não foi possível criar o cargo.";
      setError(errorMessage);
      console.error("Erro ao criar cargo:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCargo, loading, error, success };
};

export default usePostCargo;
