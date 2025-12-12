"use client";

import { useState } from "react";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import ModalMovimentacao from "@/app/src/components/modals/ModalMovimentacao";
import PaginationControls from "@/app/src/components/PaginationControls";

// HOOKS

import usePostMovimentacao, {
  MovimentacaoPayload,
} from "@/app/src/hooks/Financeiro/usePostMovimentacao";
import useDeleteMovimentacao from "@/app/src/hooks/Financeiro/useDeleteMovimentacao";
import useGetMovimentacoes from "@/app/src/hooks/Financeiro/useGetMovimentacao";

export default function FluxoCaixaPage() {
  // --- ESTADOS DE FILTRO (Inputs) ---
  const [inputDescricao, setInputDescricao] = useState("");
  const [inputCategoria, setInputCategoria] = useState("");
  const [inputDataInicio, setInputDataInicio] = useState("");
  const [inputDataFim, setInputDataFim] = useState("");

  // --- ESTADOS DE FILTRO (Efetivos p/ Hook) ---
  const [filtros, setFiltros] = useState({
    descricao: "",
    categoria: "",
    dataInicio: "",
    dataFim: "",
  });

  // --- HOOKS ---
  // O hook recarrega sempre que 'filtros' muda
  const { movimentacoes, loading, refetch } = useGetMovimentacoes(filtros);
  const { saveMovimentacao } = usePostMovimentacao();
  const { deleteMovimentacao } = useDeleteMovimentacao();

  // Estados de Paginação e Modal
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] =
    useState<any>(null);

  // Paginação no Front (Supabase retorna tudo filtrado, paginamos a view)
  const dadosPaginados = movimentacoes.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  // --- HANDLERS ---

  const handleBuscar = () => {
    setPaginaAtual(1);
    setFiltros({
      descricao: inputDescricao,
      categoria: inputCategoria,
      dataInicio: inputDataInicio,
      dataFim: inputDataFim,
    });
    // O useEffect do hook vai disparar o fetch automaticamente ao mudar 'filtros'
  };

  const handleNovaMovimentacao = () => {
    setMovimentacaoSelecionada(null);
    setIsModalOpen(true);
  };

  const handleEditarMovimentacao = (item: any) => {
    // Ajuste aqui se seu Modal espera nomes de campos diferentes
    setMovimentacaoSelecionada(item);
    setIsModalOpen(true);
  };

  const handleExcluir = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta movimentação?")) {
      if (await deleteMovimentacao(id)) {
        refetch();
      }
    }
  };

  const handleSalvar = async (dadosModal: any) => {
    // Mapeamento dos dados do Modal para o Payload do Supabase
    // Certifique-se que o Modal devolve os dados corretos (ex: valor numérico, data ISO)
    const payload: MovimentacaoPayload = {
      codmovimentacao: movimentacaoSelecionada?.codmovimentacao || null,
      descricao: dadosModal.descricao,
      categoria: dadosModal.categoria,
      subcategoria: dadosModal.subcategoria,
      valor: Number(dadosModal.valor),
      datapagamento: dadosModal.datapagamento, // YYYY-MM-DD
    };

    if (await saveMovimentacao(payload)) {
      setIsModalOpen(false);
      refetch();
    }
  };

  const formatMoney = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const [ano, mes, dia] = dateString.split("-");
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

      <h1 className={styles.title}>FLUXO DE CAIXA</h1>

      <div
        className={styles.searchContainer}
        style={{ flexWrap: "wrap", gap: "15px", alignItems: "flex-end" }}
      >
        {/* Input Descrição */}
        <div
          className={styles.inputWrapper}
          style={{ flex: 2, minWidth: "200px" }}
        >
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>
            Descrição
          </label>
          <input
            type="text"
            placeholder="Buscar descrição"
            value={inputDescricao}
            onChange={(e) => setInputDescricao(e.target.value)}
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

        {/* Input Categoria */}
        <div
          className={styles.inputWrapper}
          style={{ flex: 1, minWidth: "150px" }}
        >
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>
            Categoria
          </label>
          <input
            type="text"
            placeholder="Ex: Receita"
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

        {/* Data Inicio */}
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

        {/* Data Fim */}
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
            className={styles.primaryButton}
            onClick={handleBuscar}
            style={{
              backgroundColor: "#1769e3",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              height: "35px",
            }}
          >
            Buscar <FiSearch color="#fff" />
          </button>
        </div>

        {/* Botão Novo (Jogado pra direita) */}
        <div className={styles.searchActions} style={{ marginLeft: "auto" }}>
          <button
            className={styles.primaryButton}
            onClick={handleNovaMovimentacao}
            style={{
              height: "35px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
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
                    Carregando...
                  </td>
                </tr>
              )}

              {!loading &&
                dadosPaginados.map((item) => (
                  <tr key={item.codmovimentacao}>
                    <td>{item.descricao}</td>
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
                          gap: "5px",
                        }}
                      >
                        <button
                          className={styles.actionButton}
                          title="Editar"
                          onClick={() => handleEditarMovimentacao(item)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className={styles.deleteButton}
                          title="Excluir"
                          onClick={() => handleExcluir(item.codmovimentacao)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && movimentacoes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                    }}
                  >
                    Nenhuma movimentação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={Math.ceil(movimentacoes.length / porPagina) || 1}
          totalElementos={movimentacoes.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
