"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "@/app/src/components/Tabelas.module.css";
import PaginationControls from "@/app/src/components/PaginationControls";
import useGetUsuario from "@/app/src/hooks/Usuario/useGetUsuario";

export default function UsuariosPage() {
  const router = useRouter();

  //Declaração de todos os useStates
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaLogin, setBuscaLogin] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroLogin, setFiltroLogin] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  //Declaração de Funções e Lógica
  const { usuarios, pagination, loading, error, refetch } = useGetUsuario({
    pagina: paginaAtual,
    porPagina: porPagina,
    nome: filtroNome,
    login: filtroLogin,
    orderBy: "codUsuario",
    direction: "desc",
  });

  const handleVerDetalhes = (id: number) => {
    router.push(`/painel/Usuarios/${id}`);
  };

  const handleNovoUsuario = () => {
    router.push("/painel/Usuarios/NovoUsuario");
  };

  const handleSearch = () => {
    setPaginaAtual(1);
    setFiltroNome(buscaNome);
    setFiltroLogin(buscaLogin);
    setTimeout(() => refetch(), 0);
  };

  //Declaração de Funções de renderização
  const renderSearchSection = () => (
    <div className={styles.searchContainer}>
      <div
        style={{
          display: "flex",
          gap: "30px",
          flex: 1,
          alignItems: "flex-end",
        }}
      >
        <div className={styles.inputWrapper}>
          <label
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "4px",
              display: "block",
            }}
          >
            Nome
          </label>
          <input
            type="text"
            placeholder="Buscar por Nome"
            value={buscaNome}
            onChange={(e) => setBuscaNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "4px",
              display: "block",
            }}
          >
            Login
          </label>
          <input
            type="text"
            placeholder="Buscar por Login"
            value={buscaLogin}
            onChange={(e) => setBuscaLogin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />
        </div>

        <button
          className={styles.primaryButton}
          onClick={handleSearch}
          style={{
            backgroundColor: "#1769e3",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          Buscar <FiSearch color="#fff" />
        </button>
      </div>

      <div className={styles.searchActions}>
        <button className={styles.primaryButton} onClick={handleNovoUsuario}>
          Novo Usuário <FiPlus size={18} />
        </button>
      </div>
    </div>
  );

  const renderTableContent = () => {
    if (loading) {
      return (
        <div style={{ padding: 20, textAlign: "center" }}>
          Carregando usuários...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: 20, textAlign: "center", color: "red" }}>
          {error}
        </div>
      );
    }

    return (
      <>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Email</th>
                <th>Status</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.codUsuario}>
                  <td>{user.nome}</td>
                  <td>{user.login}</td>
                  <td>{user.email || "-"}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        user.ativo
                          ? styles.statusCompleted
                          : styles.statusNotStarted
                      }`}
                    >
                      {user.ativo ? "ATIVO" : "INATIVO"}
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
                        onClick={() => handleVerDetalhes(user.codUsuario)}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <PaginationControls
            paginaAtual={pagination.paginaAtual}
            totalPaginas={pagination.qtdPaginas}
            totalElementos={pagination.qtdElementos}
            porPagina={porPagina}
            onPageChange={setPaginaAtual}
            onItemsPerPageChange={setPorPagina}
          />
        )}
      </>
    );
  };

  //Return
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>USUÁRIOS</h1>
      {renderSearchSection()}
      <div className={styles.tableContainer}>{renderTableContent()}</div>
    </div>
  );
}
