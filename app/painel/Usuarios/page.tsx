"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiPlus } from "react-icons/fi";
import SearchBar from "@/app/src/components/SearchBar";
import PaginationControls from "@/app/src/components/PaginationControls";
import useGetUsuario from "@/app/src/hooks/Usuario/useGetUsuario";

export default function UsuariosPage() {
  const router = useRouter();

  // Estados
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  const { usuarios, pagination, loading, error, refetch } = useGetUsuario({
    pagina: paginaAtual,
    porPagina: porPagina,
    nome: busca,
    orderBy: "codUsuario",
    direction: "desc",
  });

  const handleVerDetalhes = (id: number) => {
    router.push(`/painel/Usuarios/${id}`);
  };

  const handleNovoUsuario = () => {
    router.push("/painel/Usuarios/NovoUsuario");
  };

  const handleSearch = (valor: string) => {
    setBusca(valor);
    setPaginaAtual(1);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>USUÁRIOS</h1>

      <div className={styles.searchContainer}>
        <SearchBar placeholder="Buscar por Nome" onSearch={handleSearch} />
        <div className={styles.searchActions}>
          <button className={styles.primaryButton} onClick={handleNovoUsuario}>
            Novo Usuário <FiPlus size={18} />
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            Carregando usuários...
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
                          style={{ display: "flex", justifyContent: "center" }}
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
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: 20 }}
                      >
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
        )}
      </div>
    </div>
  );
}
