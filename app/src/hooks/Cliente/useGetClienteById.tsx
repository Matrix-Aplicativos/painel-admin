import { useState, useEffect, useCallback } from "react";

import { TbClienteItem } from "./useGetTbCliente"; // Reutiliza interface
import { supabase } from "../../lib/supabaseClient";

const useGetClienteById = (id: number) => {
  const [cliente, setCliente] = useState<TbClienteItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCliente = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tbcliente")
        .select("*")
        .eq("codcliente", id)
        .single(); // Traz apenas um

      if (error) throw error;
      setCliente(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCliente();
  }, [fetchCliente]);

  return { cliente, loading, error, refetch: fetchCliente };
};

export default useGetClienteById;
