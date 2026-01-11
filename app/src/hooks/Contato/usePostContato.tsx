import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export interface ContatoPayload {
  codcontatocliente?: number | null;
  codcliente: number;
  nome: string;
  email: string;
  telefone: string;
}

const usePostContato = () => {
  const [loading, setLoading] = useState(false);

  const saveContato = async (data: ContatoPayload) => {
    setLoading(true);
    try {
      if (data.codcontatocliente) {
        // UPDATE
        const { error } = await supabase
          .from("tbcontatocliente")
          .update({
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            dataultimaalteracao: new Date().toISOString(),
          })
          .eq("codcontatocliente", data.codcontatocliente);
        if (error) throw error;
      } else {
        // INSERT
        // Removemos o ID para o banco gerar
        const { codcontatocliente, ...payload } = data;
        const { error } = await supabase.from("tbcontatocliente").insert({
          ...payload,
          datacadastro: new Date().toISOString(),
          dataultimaalteracao: new Date().toISOString(),
        });
        if (error) throw error;
      }
      return true;
    } catch (err: any) {
      console.error("Erro ao salvar contato:", err.message);
      alert("Erro ao salvar contato.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveContato, loading };
};

export default usePostContato;
