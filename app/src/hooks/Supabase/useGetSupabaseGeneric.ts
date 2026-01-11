import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

interface UseGetSupabaseResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetSupabaseGeneric = (tableName: string): UseGetSupabaseResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: supabaseError } = await supabase
        .from(tableName)
        .select("*"); // Traz todas as colunas

      if (supabaseError) throw supabaseError;

      setData(result || []);
    } catch (err: any) {
      console.error(
        `❌ [useGetSupabaseGeneric] Erro na tabela '${tableName}':`,
        err.message
      );
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useGetSupabaseGeneric;
