"use client";

import { useState, useMemo } from "react";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import ModalMovimentacao from "@/app/src/components/modals/ModalMovimentacao";
import PaginationControls from "@/app/src/components/PaginationControls";
import DashboardFluxo from "@/app/src/components/GraficoFluxo";

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
  const [viewMode, setViewMode] = useState<"mensal" | "anual">("mensal");
  const [dashboardDate, setDashboardDate] = useState(new Date());
  const [inputDescricao, setInputDescricao] = useState("");
  const [inputCategoria, setInputCategoria] = useState("");
  const [inputDataInicio, setInputDataInicio] = useState("");
  const [inputDataFim, setInputDataFim] = useState("");
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    descricao: "",
    categoria: "",
    dataInicio: "",
    dataFim: "",
  });

  const {
    movimentacoes,
    loading: loadingMov,
    refetch: refetchMov,
  } = useGetMovimentacoes({});

  const {
    parcelas,
    loading: loadingParc,
    refetch: refetchParc,
  } = useGetParcelasPagas({});

  const { saveMovimentacao } = usePostMovimentacao();
  const { deleteMovimentacao } = useDeleteMovimentacao();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] =
    useState<any>(null);

  const handleRefetchAll = () => {
    refetchMov();
    refetchParc();
  };

  const todosOsDados = useMemo(() => {
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
      const dataRef = p.datapagamento || p.datavencimento;

      return {
        codmovimentacao: p.codparcela,
        descricao: `${nomeCliente} - Parc. ${p.numparcela}`,
        valor: Number(p.valor),
        datapagamento: dataRef,
        categoria: "Receita de Vendas",
        subcategoria: tipoTraduzido,
        tipoOrigem: "PARCELA",
        idUnico: `parc-${p.codparcela}`,
      };
    });

    return [...listaManuais, ...listaParcelas].sort((a, b) => {
      const dateA = new Date(a.datapagamento).getTime();
      const dateB = new Date(b.datapagamento).getTime();
      return dateB - dateA;
    });
  }, [movimentacoes, parcelas]);

  const dadosTabelaFiltrados = useMemo(() => {
    return todosOsDados.filter((item) => {
      if (!item.datapagamento) return false;
      const matchDescricao =
        !filtrosAtivos.descricao ||
        item.descricao
          .toLowerCase()
          .includes(filtrosAtivos.descricao.toLowerCase());

      const matchCategoria =
        !filtrosAtivos.categoria ||
        item.categoria
          .toLowerCase()
          .includes(filtrosAtivos.categoria.toLowerCase()) ||
        (item.subcategoria &&
          item.subcategoria
            .toLowerCase()
            .includes(filtrosAtivos.categoria.toLowerCase()));

      let matchData = true;
      const dataItem = new Date(item.datapagamento);
      dataItem.setHours(12, 0, 0, 0);

      if (filtrosAtivos.dataInicio) {
        const dataInicio = new Date(filtrosAtivos.dataInicio);
        dataInicio.setHours(0, 0, 0, 0);
        if (dataItem < dataInicio) matchData = false;
      }

      if (filtrosAtivos.dataFim) {
        const dataFim = new Date(filtrosAtivos.dataFim);
        dataFim.setHours(23, 59, 59, 999);
        if (dataItem > dataFim) matchData = false;
      }

      return matchDescricao && matchCategoria && matchData;
    });
  }, [todosOsDados, filtrosAtivos]);

  const dadosPaginados = dadosTabelaFiltrados.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  const loading = loadingMov || loadingParc;

  const handleBuscar = () => {
    setPaginaAtual(1);
    setFiltrosAtivos({
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
    if (item.tipoOrigem === "PARCELA") {
      alert("Não é possível excluir parcelas automáticas aqui.");
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

  const formatMoney = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const dataPart = dateString.split("T")[0];
    const [ano, mes, dia] = dataPart.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className={styles.container}>
      <ModalMovimentacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        initialData={movimentacaoSelecionada}
      />

      <h1 className={styles.title} style={{ marginBottom: "20px" }}>
        FLUXO DE CAIXA
      </h1>

      <DashboardFluxo
        transacoes={todosOsDados}
        currentDate={dashboardDate}
        viewMode={viewMode}
        onDateChange={setDashboardDate}
        onViewModeChange={setViewMode}
      />

      <div
        className={styles.searchContainer}
        style={{ flexWrap: "wrap", gap: "15px", alignItems: "flex-end" }}
      >
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
              width: "95%",
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
            placeholder="Ex: Receita..."
            value={inputCategoria}
            onChange={(e) => setInputCategoria(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "95%",
              outline: "none",
            }}
          />
        </div>

        <div className={styles.inputWrapper} style={{ width: "130px" }}>
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
              width: "95%",
              outline: "none",
            }}
          />
        </div>

        <div className={styles.inputWrapper} style={{ width: "130px" }}>
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
              width: "95%",
              outline: "none",
            }}
          />
        </div>

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

        <div className={styles.searchActions} style={{ marginLeft: "auto" }}>
          <button
            onClick={handleNovaMovimentacao}
            style={{
              height: "35px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#2ecc71",
              color: "#000",
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
              {loading && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                    Carregando dados...
                  </td>
                </tr>
              )}
              {!loading && dadosPaginados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                    }}
                  >
                    Nenhum registro encontrado com estes filtros.
                  </td>
                </tr>
              )}
              {!loading &&
                dadosPaginados.map((item) => (
                  <tr key={item.idUnico}>
                    <td
                      style={{
                        fontWeight: item.tipoOrigem === "PARCELA" ? 500 : 400,
                      }}
                    >
                      {item.descricao}
                    </td>
                    <td
                      className={
                        item.valor >= 0 ? styles.textGreen : styles.textRed
                      }
                    >
                      {formatMoney(item.valor)}
                    </td>
                    <td>{formatDate(item.datapagamento)}</td>
                    <td>{item.categoria}</td>
                    <td>{item.subcategoria}</td>
                    <td className={styles.actionsCell}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
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
                          onClick={() => handleEditarMovimentacao(item)}
                        />
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
                          onClick={() => handleExcluir(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={Math.ceil(dadosTabelaFiltrados.length / porPagina) || 1}
          totalElementos={dadosTabelaFiltrados.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
