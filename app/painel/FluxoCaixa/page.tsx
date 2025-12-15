"use client";

import { useState, useMemo } from "react";
import styles from "@/app/src/components/Tabelas.module.css"; // Ajuste o caminho do CSS se necessário
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import ModalMovimentacao from "@/app/src/components/modals/ModalMovimentacao";
import PaginationControls from "@/app/src/components/PaginationControls";

// --- HOOKS ---
import usePostMovimentacao, {
  MovimentacaoPayload,
} from "@/app/src/hooks/Financeiro/usePostMovimentacao";
import useDeleteMovimentacao from "@/app/src/hooks/Financeiro/useDeleteMovimentacao";
import useGetMovimentacoes from "@/app/src/hooks/Financeiro/useGetMovimentacao";
import useGetParcelasPagas from "@/app/src/hooks/Financeiro/useGetParcelasPagas";

const TIPOS_MAP: Record<string, string> = {
  A: "Ativação",
  M: "Manutenção",
  S: "Serviço",
  O: "Outros",
};

export default function FluxoCaixaPage() {
  const [inputDescricao, setInputDescricao] = useState("");
  const [inputCategoria, setInputCategoria] = useState("");
  const [inputDataInicio, setInputDataInicio] = useState("");
  const [inputDataFim, setInputDataFim] = useState("");

  // Estado que efetivamente dispara a busca nos Hooks
  const [filtros, setFiltros] = useState({
    descricao: "",
    categoria: "",
    dataInicio: "",
    dataFim: "",
  });

  const {
    movimentacoes,
    loading: loadingMov,
    refetch: refetchMov,
  } = useGetMovimentacoes(filtros);

  const {
    parcelas,
    loading: loadingParc,
    refetch: refetchParc,
  } = useGetParcelasPagas({
    dataInicio: filtros.dataInicio,
    dataFim: filtros.dataFim,
  });

  const { saveMovimentacao } = usePostMovimentacao();
  const { deleteMovimentacao } = useDeleteMovimentacao();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] =
    useState<any>(null);

  // Função para recarregar tudo após uma ação
  const handleRefetchAll = () => {
    refetchMov();
    refetchParc();
  };

  const listaUnificada = useMemo(() => {
    const listaManuais = (movimentacoes || []).map((m) => ({
      ...m,
      tipoOrigem: "MANUAL",
      idUnico: `mov-${m.codmovimentacao}`,

      valor: Number(m.valor),
      datapagamento: m.datapagamento,
    }));

    const listaParcelas = (parcelas || []).map((p) => {
      const nomeCliente =
        p.tbcliente?.razaosocial || `Cliente #${p.codcliente}`;

      const tipoTraduzido = TIPOS_MAP[p.tipo] || p.tipo || "Parcela";

      return {
        codmovimentacao: p.codparcela,

        descricao: `${nomeCliente} - Parc. ${p.numparcela}`,

        valor: Number(p.valor),

        datapagamento: p.datapagamento || p.datavencimento,

        categoria: "Receita de Vendas",
        subcategoria: tipoTraduzido,

        tipoOrigem: "PARCELA",
        idUnico: `parc-${p.codparcela}`,
      };
    });

    let tudo = [...listaManuais, ...listaParcelas];

    if (filtros.descricao) {
      const termo = filtros.descricao.toLowerCase();
      tudo = tudo.filter((item) =>
        (item.descricao || "").toLowerCase().includes(termo)
      );
    }
    if (filtros.categoria) {
      const termo = filtros.categoria.toLowerCase();
      tudo = tudo.filter(
        (item) =>
          (item.categoria || "").toLowerCase().includes(termo) ||
          (item.subcategoria || "").toLowerCase().includes(termo)
      );
    }

    return tudo.sort((a, b) => {
      const dateA = a.datapagamento ? new Date(a.datapagamento).getTime() : 0;
      const dateB = b.datapagamento ? new Date(b.datapagamento).getTime() : 0;
      return dateB - dateA;
    });
  }, [movimentacoes, parcelas, filtros.descricao, filtros.categoria]);

  // Paginação dos dados unificados
  const dadosPaginados = listaUnificada.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  const loading = loadingMov || loadingParc;

  const handleBuscar = () => {
    setPaginaAtual(1); // Volta para pagina 1 ao filtrar
    setFiltros({
      descricao: inputDescricao,
      categoria: inputCategoria,
      dataInicio: inputDataInicio,
      dataFim: inputDataFim,
    });
  };

  const handleNovaMovimentacao = () => {
    setMovimentacaoSelecionada(null);
    setIsModalOpen(true);
  };

  const handleEditarMovimentacao = (item: any) => {
    // Bloqueia edição de parcela automática
    if (item.tipoOrigem === "PARCELA") {
      alert(
        `O recebimento "${item.descricao}" é automático.\nPara alterar, vá até o cadastro do Cliente > Vendas.`
      );
      return;
    }
    setMovimentacaoSelecionada(item);
    setIsModalOpen(true);
  };

  const handleExcluir = async (item: any) => {
    // Bloqueia exclusão de parcela automática
    if (item.tipoOrigem === "PARCELA") {
      alert(
        "Não é possível excluir parcelas automáticas aqui.\nFaça o estorno na tela de Vendas do Cliente."
      );
      return;
    }
    if (confirm(`Tem certeza que deseja excluir: ${item.descricao}?`)) {
      if (await deleteMovimentacao(item.codmovimentacao)) {
        handleRefetchAll();
      }
    }
  };

  const handleSalvar = async (dadosModal: any) => {
    const payload: MovimentacaoPayload = {
      codmovimentacao: movimentacaoSelecionada?.codmovimentacao || null,
      descricao: dadosModal.descricao,
      categoria: dadosModal.categoria,
      subcategoria: dadosModal.subcategoria,
      valor: Number(dadosModal.valor),
      datapagamento: dadosModal.datapagamento,
    };

    if (await saveMovimentacao(payload)) {
      setIsModalOpen(false);
      handleRefetchAll();
    }
  };

  // Funções Auxiliares de Formatação
  const formatMoney = (val: number) => {
    if (isNaN(val)) return "R$ 0,00";
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const datePart = dateString.split("T")[0];
    const [ano, mes, dia] = datePart.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className={styles.container}>
      {/* Modal de Cadastro/Edição */}
      <ModalMovimentacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        initialData={movimentacaoSelecionada}
      />

      <h1 className={styles.title}>FLUXO DE CAIXA</h1>

      {/* --- BARRA DE FILTROS --- */}
      <div
        className={styles.searchContainer}
        style={{ flexWrap: "wrap", gap: "15px", alignItems: "flex-end" }}
      >
        {/* Filtro Descrição */}
        <div
          className={styles.inputWrapper}
          style={{ flex: 2, minWidth: "200px" }}
        >
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>
            Descrição / Cliente
          </label>
          <input
            type="text"
            placeholder="Buscar..."
            value={inputDescricao}
            onChange={(e) => setInputDescricao(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
            className={styles.inputField}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "90%",
              outline: "none",
            }}
          />
        </div>

        <div
          className={styles.inputWrapper}
          style={{ flex: 1, minWidth: "150px" }}
        >
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>
            Categoria
          </label>
          <input
            type="text"
            placeholder="Ex: Receita, Vendas..."
            value={inputCategoria}
            onChange={(e) => setInputCategoria(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "90%",
              outline: "none",
            }}
          />
        </div>

        {/* Filtro Data Início */}
        <div className={styles.inputWrapper} style={{ width: "140px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>
            Data Início
          </label>
          <input
            type="date"
            value={inputDataInicio}
            onChange={(e) => setInputDataInicio(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "90%",
              outline: "none",
            }}
          />
        </div>

        {/* Filtro Data Fim */}
        <div className={styles.inputWrapper} style={{ width: "140px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>
            Data Fim
          </label>
          <input
            type="date"
            value={inputDataFim}
            onChange={(e) => setInputDataFim(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "90%",
              outline: "none",
            }}
          />
        </div>

        {/* Botão Buscar */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={handleBuscar}
            style={{
              backgroundColor: "#1769e3",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              height: "35px",
              padding: "0 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Buscar <FiSearch />
          </button>
        </div>

        {/* Botão Novo */}
        <div className={styles.searchActions} style={{ marginLeft: "auto" }}>
          <button
            onClick={handleNovaMovimentacao}
            style={{
              height: "35px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#2ecc71",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0 15px",
              cursor: "pointer",
            }}
          >
            Nova Movimentação <FiPlus size={18} />
          </button>
        </div>
      </div>

      {/* --- TABELA DE RESULTADOS --- */}
      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data Pagamento</th>
                <th>Categoria</th>
                <th>Sub Categoria</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Loader */}
              {loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                    Carregando dados...
                  </td>
                </tr>
              )}

              {/* Lista Vazia */}
              {!loading && dadosPaginados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                    }}
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}

              {/* Linhas da Tabela */}
              {!loading &&
                dadosPaginados.map((item) => (
                  <tr key={item.idUnico}>
                    {/* Coluna 2: Descrição */}
                    <td
                      style={{
                        fontWeight: item.tipoOrigem === "PARCELA" ? 500 : 400,
                      }}
                    >
                      {item.descricao}
                    </td>

                    {/* Coluna 3: Valor (Verde ou Vermelho) */}
                    <td
                      className={
                        item.valor >= 0 ? styles.textGreen : styles.textRed
                      }
                    >
                      {formatMoney(item.valor)}
                    </td>

                    {/* Coluna 4: Data */}
                    <td>{formatDate(item.datapagamento)}</td>

                    {/* Coluna 5: Categoria */}
                    <td>{item.categoria}</td>

                    {/* Coluna 6: Subcategoria (Tipo) */}
                    <td>{item.subcategoria}</td>

                    {/* Coluna 7: Ações (Editar/Excluir) */}
                    <td className={styles.actionsCell}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        {/* Botão Editar */}
                        <FiEdit
                          className={
                            item.tipoOrigem === "PARCELA"
                              ? styles.disabledIcon
                              : styles.actionIcon
                          }
                          color={
                            item.tipoOrigem === "PARCELA" ? "#ccc" : "#f39c12"
                          }
                          size={18}
                          style={{
                            cursor:
                              item.tipoOrigem === "PARCELA"
                                ? "not-allowed"
                                : "pointer",
                          }}
                          onClick={() => handleEditarMovimentacao(item)}
                          title={
                            item.tipoOrigem === "PARCELA"
                              ? "Gerenciado em Vendas"
                              : "Editar"
                          }
                        />

                        {/* Botão Excluir */}
                        <FiTrash2
                          className={
                            item.tipoOrigem === "PARCELA"
                              ? styles.disabledIcon
                              : styles.actionIcon
                          }
                          color={
                            item.tipoOrigem === "PARCELA" ? "#ccc" : "#e74c3c"
                          }
                          size={18}
                          style={{
                            cursor:
                              item.tipoOrigem === "PARCELA"
                                ? "not-allowed"
                                : "pointer",
                          }}
                          onClick={() => handleExcluir(item)}
                          title={
                            item.tipoOrigem === "PARCELA"
                              ? "Gerenciado em Vendas"
                              : "Excluir"
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* --- CONTROLES DE PAGINAÇÃO --- */}
        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={Math.ceil(listaUnificada.length / porPagina) || 1}
          totalElementos={listaUnificada.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
