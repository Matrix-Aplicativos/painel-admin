"use client";

import { useState } from "react";
import styles from "../../../../src/components/Tabelas.module.css";
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";
import ModalParcela from "@/app/src/components/modals/ModalParcela";
import PaginationControls from "@/app/src/components/PaginationControls";

import useGetClienteById from "@/app/src/hooks/Cliente/useGetClienteById";
import useGetParcelas, {
  ParcelaItem,
} from "@/app/src/hooks/Financeiro/useGetParcelas";
import usePostParcela, {
  ParcelaPayload,
} from "@/app/src/hooks/Financeiro/usePostParcelas";
import useDeleteParcela from "@/app/src/hooks/Financeiro/useDeleteParcelas";

const TIPOS_MAP: Record<string, string> = {
  A: "Ativação",
  M: "Manutenção",
  S: "Serviço",
  O: "Outros",
};

export default function ParcelasPage() {
  const params = useParams();
  const idCliente = Number(params.id);

  const { cliente } = useGetClienteById(idCliente);
  const { parcelas, loading, refetch } = useGetParcelas(idCliente);

  const { saveParcela } = usePostParcela();
  const { deleteParcela } = useDeleteParcela();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parcelaSelecionada, setParcelaSelecionada] = useState<any>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const porPagina = 20;
  const parcelasPaginadas = parcelas.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  const handleNovo = () => {
    setParcelaSelecionada(null);
    setIsModalOpen(true);
  };

  const handleEditar = (item: ParcelaItem) => {
    setParcelaSelecionada(item);
    setIsModalOpen(true);
  };

  const handleExcluir = async (id: number) => {
    if (confirm("Deseja excluir esta parcela?")) {
      if (await deleteParcela(id)) refetch();
    }
  };

  const parseDateToISO = (dateStr: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const formatDateTable = (dateStr: string) => {
    if (!dateStr) return "-";
    const cleanDate = dateStr.split("T")[0];
    const [year, month, day] = cleanDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSalvar = async (dadosForm: any) => {
    const valorNumerico =
      typeof dadosForm.valor === "string"
        ? Number(
            dadosForm.valor
              .replace("R$", "")
              .replace(/\./g, "")
              .replace(",", ".")
              .trim()
          )
        : dadosForm.valor;

    const dataVencimentoISO = parseDateToISO(dadosForm.datavencimento);
    const dataPagamentoISO = parseDateToISO(dadosForm.datapagamento);

    if (!dataVencimentoISO) {
      alert("Data de vencimento inválida.");
      return;
    }

    const payload: ParcelaPayload = {
      codparcela: dadosForm.codparcela || null,
      codcliente: idCliente,
      numparcela: Number(dadosForm.numparcela),
      valor: valorNumerico,
      datavencimento: dataVencimentoISO,
      tipo: dadosForm.tipo,
      datapagamento: dataPagamentoISO,
      pago: !!dataPagamentoISO,
    };

    if (await saveParcela(payload)) {
      setIsModalOpen(false);
      refetch();
    }
  };

  return (
    <div className={styles.container}>
      <ModalParcela
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        initialData={parcelaSelecionada}
      />

      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link
              href={`/painel/Clientes/${idCliente}`}
              style={{ color: "#333", display: "flex" }}
            >
              <FiArrowLeft size={24} />
            </Link>

            <h1
              className={styles.title}
              style={{ marginBottom: 0, marginTop: 0, lineHeight: "1" }}
            >
              {cliente?.razaosocial || "CLIENTE"}
            </h1>
          </div>
          <button className={styles.primaryButton} onClick={handleNovo}>
            Nova Parcela <FiPlus size={18} />
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nº Parcela</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Tipo</th>
                <th>Pago</th>
                <th>Data Pagamento</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                    Carregando...
                  </td>
                </tr>
              )}

              {!loading &&
                parcelasPaginadas.map((item) => (
                  <tr key={item.codparcela}>
                    <td>{item.numparcela}</td>
                    <td>
                      {Number(item.valor).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td>{formatDateTable(item.datavencimento)}</td>
                    <td>{TIPOS_MAP[item.tipo] || item.tipo}</td>
                    <td>
                      <span
                        style={{
                          color: item.pago ? "#00e676" : "#ff4444",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.pago ? "SIM" : "NÃO"}
                      </span>
                    </td>
                    <td>
                      {item.datapagamento
                        ? formatDateTable(item.datapagamento)
                        : "-"}
                    </td>
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
                          style={{ padding: "8px", minWidth: "auto" }}
                          title="Editar"
                          onClick={() => handleEditar(item)}
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          className={styles.deleteButton}
                          style={{ padding: "8px" }}
                          title="Excluir"
                          onClick={() => handleExcluir(item.codparcela)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && parcelas.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                    Nenhuma parcela encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={Math.ceil(parcelas.length / porPagina) || 1}
          totalElementos={parcelas.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={() => {}}
        />
      </div>
    </div>
  );
}
