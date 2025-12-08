"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import styles from "@/app/src/components/Tabelas.module.css";
import { FiPlus } from "react-icons/fi";
import SearchBar from "@/app/src/components/SearchBar";
import PaginationControls from "@/app/src/components/PaginationControls";

const MOCK = [
  { id: 1, nome: "Admin Master", login: "admin@movix.com", status: true },
  { id: 2, nome: "Roberto Silva", login: "roberto.silva", status: true },
  { id: 3, nome: "Ana Paula", login: "ana.paula", status: true },
  { id: 4, nome: "Carlos Souza", login: "carlos.souza", status: false },
];

export default function UsuariosPage() {
  const [dados] = useState(MOCK);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const router = useRouter();

  // Função de navegação
  const handleVerDetalhes = (id: number) => {
    router.push(`/painel/Usuarios/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>USUÁRIOS</h1>

      <div className={styles.searchContainer}>
        <SearchBar placeholder="Buscar por Nome ou Login" onSearch={() => {}} />
        <div className={styles.searchActions}>
          <button className={styles.primaryButton}>
            <FiPlus size={18} /> Novo Usuário
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Status</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((user) => (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>{user.login}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        user.status
                          ? styles.statusCompleted
                          : styles.statusNotStarted
                      }`}
                    >
                      {user.status ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {/* Botão Ver Detalhes */}
                      <button
                        className={styles.btnDetails}
                        onClick={() => handleVerDetalhes(user.id)}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={1}
          totalElementos={dados.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
