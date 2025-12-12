import { useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";


export interface ClientePayload {
  codcliente?: number | null; // Se vier, é update. Se null, é insert.
  razaosocial: string;
  cnpj: string;
  cep: string;
  endereco: string; // Se o banco tem colunas separadas para cidade/uf, ajuste aqui
  observacoes?: string; // Mapeado para descricaoIntegracao ou obs
  situacao: string; // '1', '2', '3', '4'
}

interface UsePostClienteResult {
  saveCliente: (data: ClientePayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const usePostCliente = (): UsePostClienteResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveCliente = useCallback(async (data: ClientePayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (data.codcliente) {
        const { error: err } = await supabase
          .from("tbcliente")
          .update({
            razaosocial: data.razaosocial,
            cnpj: data.cnpj,
            cep: data.cep,
            endereco: data.endereco,
            observacoes: data.observacoes,
            situacao: data.situacao,
            dataultimaalteracao: new Date().toISOString(),
          })
          .eq("codcliente", data.codcliente);

        if (err) throw err;
      } else {
        const { codcliente, ...dadosParaInserir } = data;

        const { error: err } = await supabase.from("tbcliente").insert({
          ...dadosParaInserir,
          datacadastro: new Date().toISOString(),
          dataultimaalteracao: new Date().toISOString(),
        });

        if (err) throw err;
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error("Erro ao salvar cliente:", err.message);
      setError(err.message || "Erro ao salvar cliente.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveCliente, loading, error, success };
};

export default usePostCliente;
