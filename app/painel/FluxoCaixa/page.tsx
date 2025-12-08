"use client";

import { useState, useMemo } from "react";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiEdit, FiTrash2, FiRefreshCw } from "react-icons/fi";
import SearchBar from "@/app/src/components/SearchBar";
import PaginationControls from "@/app/src/components/PaginationControls";
import GraficoFluxo from "@/app/src/components/GraficoFluxo";

const MOCK_FLUXO = [
  {
    id: 1,
    descricao: "Venda de Consultoria",
    valor: 5000.0,
    data: "2023-10-01",
    categoria: "Receita",
    subCategoria: "Serviços",
    tipo: "entrada",
  },
  {
    id: 2,
    descricao: "Conta de Luz",
    valor: -350.5,
    data: "2023-10-05",
    categoria: "Despesa Fixa",
    subCategoria: "Energia",
    tipo: "saida",
  },
  {
    id: 3,
    descricao: "Venda de Software",
    valor: 12000.0,
    data: "2023-10-10",
    categoria: "Receita",
    subCategoria: "Licenças",
    tipo: "entrada",
  },
  {
    id: 4,
    descricao: "Aluguel Escritório",
    valor: -2500.0,
    data: "2023-10-10",
    categoria: "Despesa Fixa",
    subCategoria: "Aluguel",
    tipo: "saida",
  },
  {
    id: 5,
    descricao: "Compra de Periféricos",
    valor: -800.0,
    data: "2023-10-15",
    categoria: "Despesa Variável",
    subCategoria: "Equipamentos",
    tipo: "saida",
  },
  {
    id: 6,
    descricao: "Manutenção Servidor",
    valor: -450.0,
    data: "2023-10-20",
    categoria: "Despesa Operacional",
    subCategoria: "TI",
    tipo: "saida",
  },
  {
    id: 7,
    descricao: "Venda de Treinamento",
    valor: 3500.0,
    data: "2023-11-01",
    categoria: "Receita",
    subCategoria: "Cursos",
    tipo: "entrada",
  },
];

export default function FluxoCaixaPage() {
  const [dados] = useState(MOCK_FLUXO);
  const [busca, setBusca] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  const dadosFiltrados = useMemo(() => {
    return dados.filter((item) => {
      const matchTexto =
        item.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        item.categoria.toLowerCase().includes(busca.toLowerCase());

      const matchInicio = dataInicio ? item.data >= dataInicio : true;
      const matchFim = dataFim ? item.data <= dataFim : true;

      return matchTexto && matchInicio && matchFim;
    });
  }, [dados, busca, dataInicio, dataFim]);

  const formatMoney = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateString: string) => {
    const [ano, mes, dia] = dateString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>FLUXO DE CAIXA</h1>

      <div className={styles.searchContainer}>
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <SearchBar
            placeholder="Buscar por descrição ou categoria"
            onSearch={(val: string) => {
              setBusca(val);
              setPaginaAtual(1);
            }}
          />

          {/* Inputs de Data */}
          <div className={styles.filterGroup}>
            <input
              type="date"
              className={styles.dateInput}
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              title="Data Início"
            />

            <input
              type="date"
              className={styles.dateInput}
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              title="Data Fim"
            />
          </div>
        </div>
        <button className={styles.actionButton}>
          <span>Atualizar</span> <FiRefreshCw />
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Categoria</th>
                <th>Sub Categoria</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.descricao}</td>
                    <td
                      className={
                        item.valor >= 0 ? styles.textGreen : styles.textRed
                      }
                    >
                      {formatMoney(item.valor)}
                    </td>
                    <td>{formatDate(item.data)}</td>
                    <td>{item.categoria}</td>
                    <td>{item.subCategoria}</td>
                    <td className={styles.actionsCell}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                      >
                        <button className={styles.actionButton} title="Editar">
                          <FiEdit />
                        </button>
                        <button className={styles.deleteButton} title="Excluir">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "var(--text-placeholder-color)",
                    }}
                  >
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={1}
          totalElementos={dadosFiltrados.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
