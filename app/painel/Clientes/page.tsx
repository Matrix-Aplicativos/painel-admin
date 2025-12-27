"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiPlus, FiSearch } from "react-icons/fi";
import ModalCliente from "@/app/src/components/modals/ModalCliente";
import PaginationControls from "@/app/src/components/PaginationControls";
import useGetTbCliente from "@/app/src/hooks/Cliente/useGetTbCliente";

export default function ClientesPage() {
  const router = useRouter();

  // Estados dos Inputs (O que o usuário digita)
  const [buscaRazao, setBuscaRazao] = useState("");
  const [buscaCnpj, setBuscaCnpj] = useState("");

  // Estados dos Filtros (O que vai para o Hook)
  const [filtroRazao, setFiltroRazao] = useState("");
  const [filtroCnpj, setFiltroCnpj] = useState("");

  // Hook escuta os filtros
  const { clientes, loading, error, refetch } = useGetTbCliente({
    razaoSocial: filtroRazao,
    cnpj: filtroCnpj,
  });

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Paginação no Front
  const clientesPaginados = clientes.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  const handleBuscar = () => {
    setPaginaAtual(1);
    setFiltroRazao(buscaRazao);
    setFiltroCnpj(buscaCnpj);
    setTimeout(() => refetch(), 0);
  };

  const getStatusConfig = (statusString: string) => {
    const status = Number(statusString);
    switch (status) {
      case 1:
        return {
          label: "ATIVO",
          className: styles.statusCompleted,
          style: {},
        };
      case 2:
        return {
          label: "CANCELADO",
          className: styles.statusNotStarted,
          style: { backgroundColor: "#ffebee", color: "#c62828" },
        };
      case 3:
        return {
          label: "EM NEGOCIAÇÃO",
          className: styles.statusBadge,
          style: { backgroundColor: "#fff3e0", color: "#ef6c00" },
        };
      case 4:
        return {
          label: "PROSPECÇÃO",
          className: styles.statusBadge,
          style: { backgroundColor: "#e3f2fd", color: "#1565c0" },
        };
      default:
        return {
          label: "DESCONHECIDO",
          className: styles.statusNotStarted,
          style: {},
        };
    }
  };

  const handleVerDetalhes = (id: number) => {
    router.push(`/painel/Clientes/${id}`);
  };

  const handleNovoCliente = () => {
    setIsModalOpen(true);
  };

  const handleSalvarCliente = () => {
    refetch();
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <ModalCliente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSalvarCliente} 
        initialData={null}
      />

      <h1 className={styles.title}>CLIENTES</h1>

      <div className={styles.searchContainer}>
        <div
          style={{
            display: "flex",
            gap: "30px",
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          {/* Input Razão Social */}
          <div className={styles.inputWrapper} style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                display: "block",
                fontWeight: 600,
              }}
            >
              Razão Social
            </label>
            <input
              type="text"
              placeholder="Buscar por Razão Social"
              value={buscaRazao}
              onChange={(e) => setBuscaRazao(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          {/* Input CNPJ */}
          <div className={styles.inputWrapper} style={{ width: "250px" }}>
            <label
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                display: "block",
                fontWeight: 600,
              }}
            >
              CNPJ
            </label>
            <input
              type="text"
              placeholder="Buscar por CNPJ"
              value={buscaCnpj}
              onChange={(e) => setBuscaCnpj(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          <button
            className={styles.primaryButton}
            onClick={handleBuscar}
            style={{
              backgroundColor: "#1769e3",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              height: "35px", // Ajuste fino para alinhar com inputs
            }}
          >
            Buscar <FiSearch color="#fff" />
          </button>
        </div>

        <div className={styles.searchActions}>
          <button
            className={styles.primaryButton}
            onClick={handleNovoCliente}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              height: "35px",
            }}
          >
            Novo Cliente <FiPlus size={18} />
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            Carregando clientes...
          </div>
        ) : error ? (
          <div style={{ padding: 20, textAlign: "center", color: "red" }}>
            {error}
          </div>
        ) : (
          <>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Razão Social</th>
                    <th>CNPJ</th>
                    <th>Situação</th>
                    <th className={styles.actionsCell}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesPaginados.map((cliente) => {
                    const statusConfig = getStatusConfig(cliente.situacao);
                    return (
                      <tr key={cliente.codcliente}>
                        <td>{cliente.razaosocial || "-"}</td>
                        <td>{cliente.cnpj || "-"}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${statusConfig.className}`}
                            style={statusConfig.style}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className={styles.actionsCell}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className={styles.btnDetails}
                              onClick={() =>
                                handleVerDetalhes(cliente.codcliente)
                              }
                            >
                              Ver detalhes
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {clientes.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{ textAlign: "center", padding: 20 }}
                      >
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControls
              paginaAtual={paginaAtual}
              totalPaginas={Math.ceil(clientes.length / porPagina) || 1}
              totalElementos={clientes.length}
              porPagina={porPagina}
              onPageChange={setPaginaAtual}
              onItemsPerPageChange={setPorPagina}
            />
          </>
        )}
      </div>
    </div>
  );
}
