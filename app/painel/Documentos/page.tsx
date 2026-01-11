"use client";

import { useState } from "react";
import { FiPlus, FiFileText, FiTrash2, FiExternalLink } from "react-icons/fi";
import PaginationControls from "@/app/src/components/PaginationControls";
import useGetDocumentos, {
  DocumentoItem,
} from "@/app/src/hooks/Documentos/useGetDocumentos";
import usePostDocumento from "@/app/src/hooks/Documentos/usePostDocumentos";
import useDeleteDocumento from "@/app/src/hooks/Documentos/useDeleteDocumentos";
import ModalNovoDocumento from "@/app/src/components/modals/ModalNovoDocumento";
import styles from "./DocumentosPage.module.css";

export default function DocumentosPage() {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { documenti, loading, refetch, openDocumento } = useGetDocumentos();
  const { saveDocumento, loading: loadingSave } = usePostDocumento();
  const { deleteDocumento } = useDeleteDocumento();

  const listaDocs = (documenti as unknown as DocumentoItem[]) || [];
  const totalElementos = listaDocs.length;
  const totalPaginas = Math.ceil(totalElementos / porPagina) || 1;
  const dadosPaginados = listaDocs.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  const handleSalvarDocumento = async (nome: string, arquivo: File) => {
    const sucesso = await saveDocumento(nome, arquivo);
    if (sucesso) {
      setIsModalOpen(false);
      refetch();
    }
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      const sucesso = await deleteDocumento(id);
      if (sucesso) refetch();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>DOCUMENTOS</h1>

      <button onClick={() => setIsModalOpen(true)} className={styles.btnNovo}>
        Novo Documento <FiPlus size={18} />
      </button>

      {loading ? (
        <p>Carregando documentos...</p>
      ) : (
        <div className={styles.gridContainer}>
          {dadosPaginados.length === 0 && (
            <p className={styles.emptyState}>Nenhum documento encontrado.</p>
          )}

          {dadosPaginados.map((doc) => (
            <div key={doc.coddocumento} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <FiFileText size={35} color="#3498db" />
                </div>
                <span className={styles.cardTitle}>{doc.nome}</span>
              </div>

              <div className={styles.actionsRow}>
                <button
                  className={styles.btnAcessar}
                  onClick={() => openDocumento(doc.coddocumento)}
                  title="Abrir em nova guia"
                >
                  Acessar <FiExternalLink size={14} style={{ marginLeft: 5 }} />
                </button>
                <button
                  className={styles.btnDelete}
                  onClick={() => handleExcluir(doc.coddocumento, doc.nome)}
                  title="Excluir"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.paginationWrapper}>
        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalElementos={totalElementos}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>

      <ModalNovoDocumento
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvarDocumento}
        loading={loadingSave}
      />
    </div>
  );
}
