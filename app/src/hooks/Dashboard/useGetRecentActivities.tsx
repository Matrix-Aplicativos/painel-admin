import { useState, useEffect } from "react";
import { supabase } from "@/app/src/lib/supabaseClient";

export interface AtividadeItem {
  id: string;
  titulo: string;
  acao: string;
  data: string;
  timestamp: number;
}

export default function useGetRecentActivities() {
  const [atividades, setAtividades] = useState<AtividadeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const { data: clientes } = await supabase
          .from("tbcliente")
          .select("codcliente, razaosocial, datacadastro")
          .order("datacadastro", { ascending: false })
          .limit(3);

        const { data: movimentacoes } = await supabase
          .from("tbmovimentacao")
          .select("codmovimentacao, descricao, valor, datacadastro")
          .order("datacadastro", { ascending: false })
          .limit(3);

        const { data: documentos } = await supabase
          .from("tbdocumento")
          .select("coddocumento, nome, datacadastro")
          .order("datacadastro", { ascending: false })
          .limit(3);

        const listaMista: AtividadeItem[] = [];

        clientes?.forEach((c) => {
          listaMista.push({
            id: `cli-${c.codcliente}`,
            titulo: c.razaosocial,
            acao: "Novo Cliente Cadastrado",
            data: new Date(c.datacadastro).toLocaleDateString("pt-BR"),
            timestamp: new Date(c.datacadastro).getTime(),
          });
        });

        movimentacoes?.forEach((m) => {
          listaMista.push({
            id: `mov-${m.codmovimentacao}`,
            titulo: m.descricao,
            acao: `Movimentação: R$ ${Number(m.valor).toFixed(2)}`,
            data: new Date(m.datacadastro).toLocaleDateString("pt-BR"),
            timestamp: new Date(m.datacadastro).getTime(),
          });
        });

        documentos?.forEach((d) => {
          listaMista.push({
            id: `doc-${d.coddocumento}`,
            titulo: d.nome,
            acao: "Documento Anexado",
            data: new Date(d.datacadastro).toLocaleDateString("pt-BR"),
            timestamp: new Date(d.datacadastro).getTime(),
          });
        });

        const ordenado = listaMista
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5); 

        setAtividades(ordenado);
      } catch (err) {
        console.error("Erro ao buscar atividades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { atividades, loading };
}
