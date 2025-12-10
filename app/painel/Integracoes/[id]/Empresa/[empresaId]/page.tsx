"use client";

import styles from "./DetalhesEmpresa.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PaginationControls from "@/app/src/components/PaginationControls";
import ModalEditConfig from "@/app/src/components/modals/ModalEditConfig";

import useGetEmpresaById, {
  EmpresaDetalhe,
} from "@/app/src/hooks/Empresa/useGetEmpresaById";
import useDeleteEmpresa from "@/app/src/hooks/Empresa/useDeleteEmpresa"; 

const MOCK_CONFIGS = [
  { id: 1, cod: 1, descricao: "Permite Desconto", valor: "S", status: true },
  { id: 2, cod: 2, descricao: "Limite Crédito", valor: "1000", status: true },
  {
    id: 3,
    cod: 3,
    descricao: "Bloqueia Inadimplente",
    valor: "N",
    status: false,
  },
];

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const empresaId = Number(params.empresaId);
  const integracaoId = params.id; 

  const { empresa, loading, error, refetch } = useGetEmpresaById(empresaId);
  const { deleteEmpresa, loading: loadingDelete } = useDeleteEmpresa(); 

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EmpresaDetalhe>>({});

  const [configs, setConfigs] = useState(MOCK_CONFIGS);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [isModalConfigOpen, setIsModalConfigOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);

  useEffect(() => {
    if (empresa) {
      setFormData({
        ...empresa,
      });
    }
  }, [empresa]);

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelarEdicao = () => {
    setIsEditing(false);
    if (empresa) setFormData({ ...empresa });
  };

  const handleSalvarEdicao = () => {
    console.log("Dados para salvar:", formData);
    setIsEditing(false);
    refetch();
  };

  const handleExcluir = async () => {
    const confirmacao = window.confirm(
      "Deseja realmente excluir esta empresa? Esta ação não pode ser desfeita."
    );

    if (confirmacao) {
      const sucesso = await deleteEmpresa(empresaId);

      if (sucesso) {
        alert("Empresa excluída com sucesso!");
        router.push(`/painel/Integracoes/${integracaoId}`);
      }
    }
  };

  const handleInputChange = (field: keyof EmpresaDetalhe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditConfig = (config: any) => {
    setSelectedConfig(config);
    setIsModalConfigOpen(true);
  };

  const handleSaveConfigModal = (newData: any) => {
    const newConfigs = configs.map((c) => (c.id === newData.id ? newData : c));
    setConfigs(newConfigs);
    setIsModalConfigOpen(false);
  };

  if (loading)
    return (
      <div className={styles.container}>
        <p>Carregando dados da empresa...</p>
      </div>
    );
  if (error || !empresa)
    return (
      <div className={styles.container}>
        <p>Erro ao carregar empresa.</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <ModalEditConfig
        isOpen={isModalConfigOpen}
        onClose={() => setIsModalConfigOpen(false)}
        onSave={handleSaveConfigModal}
        data={selectedConfig}
      />

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{empresa.razaoSocial?.toUpperCase()}</h1>
          <span
            className={`${styles.statusBadge} ${
              empresa.ativo ? styles.statusActive : styles.statusInactive
            }`}
            style={{
              backgroundColor: empresa.ativo ? "#e6fffa" : "#fff5f5",
              color: empresa.ativo ? "#2c7a7b" : "#c53030",
            }}
          >
            {empresa.ativo ? "ATIVO" : "INATIVO"}
          </span>
        </div>

        <div className={styles.headerButtons}>
          {!isEditing ? (
            <div className={styles.buttonRow}>
              <button
                className={`${styles.btn} ${styles.btnBlue}`}
                onClick={handleEditar}
                disabled={loadingDelete}
              >
                Editar <FiEdit2 />
              </button>
              <button
                className={`${styles.btn} ${styles.btnRed}`}
                onClick={handleExcluir}
                disabled={loadingDelete} 
              >
                {loadingDelete ? "Excluindo..." : "Excluir"} <FiTrash2 />
              </button>
            </div>
          ) : (
            <div className={styles.buttonRow}>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={handleSalvarEdicao}
              >
                Salvar <FiCheck />
              </button>
              <button
                className={`${styles.btn} ${styles.btnRed}`}
                onClick={handleCancelarEdicao}
              >
                Cancelar <FiX />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>Razão Social</label>
            <input
              type="text"
              value={formData.razaoSocial || ""}
              onChange={(e) => handleInputChange("razaoSocial", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Nome Fantasia</label>
            <input
              type="text"
              value={formData.nomeFantasia || ""}
              onChange={(e) =>
                handleInputChange("nomeFantasia", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>CNPJ</label>
            <input type="text" value={formData.cnpj || ""} disabled />
          </div>
          <div className={styles.inputWrapper}>
            <label>Cód. ERP</label>
            <input
              type="text"
              value={formData.codEmpresaErp || ""}
              onChange={(e) =>
                handleInputChange("codEmpresaErp", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Cidade / UF</label>
            <input
              type="text"
              value={
                formData.municipio
                  ? `${formData.municipio.nome} - ${formData.municipio.uf}`
                  : ""
              }
              disabled
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Bairro</label>
            <input
              type="text"
              value={formData.bairro || ""}
              onChange={(e) => handleInputChange("bairro", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.sectionTitle} style={{ marginTop: "20px" }}>
          Permissões e Licenças
        </div>

        <div className={styles.togglesRow} style={{ marginBottom: "20px" }}>
          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>Movix (Coleta)</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={formData.acessoColeta || false}
                onChange={(e) =>
                  handleInputChange("acessoColeta", e.target.checked)
                }
                disabled={!isEditing}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>Força de Vendas</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={formData.acessoFdv || false}
                onChange={(e) =>
                  handleInputChange("acessoFdv", e.target.checked)
                }
                disabled={!isEditing}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {formData.acessoColeta && (
          <div
            className={styles.subGroup}
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <h4 style={{ marginBottom: "10px", color: "#555" }}>
              Detalhes Movix
            </h4>
            <div className={styles.inputRow}>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "150px" }}
              >
                <label>Máx. Disp.</label>
                <input
                  type="number"
                  value={formData.maxDispositivosColeta || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "maxDispositivosColeta",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "150px" }}
              >
                <label>Máx. Multi</label>
                <input
                  type="number"
                  value={formData.maxDispositivosMultiColeta || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "maxDispositivosMultiColeta",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "180px" }}
              >
                <label>Validade Licença</label>
                <input
                  type="date"
                  value={
                    formData.validadeLicencaColeta
                      ? String(formData.validadeLicencaColeta).split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("validadeLicencaColeta", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        {formData.acessoFdv && (
          <div
            className={styles.subGroup}
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ marginBottom: "10px", color: "#555" }}>
              Detalhes Força de Vendas
            </h4>
            <div className={styles.inputRow}>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "150px" }}
              >
                <label>Máx. Disp.</label>
                <input
                  type="number"
                  value={formData.maxDispositivosFdv || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "maxDispositivosFdv",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "150px" }}
              >
                <label>Máx. Multi</label>
                <input
                  type="number"
                  value={formData.maxDispositivosMultiFdv || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "maxDispositivosMultiFdv",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "180px" }}
              >
                <label>Validade Licença</label>
                <input
                  type="date"
                  value={
                    formData.validadeLicencaFdv
                      ? String(formData.validadeLicencaFdv).split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("validadeLicencaFdv", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.configSection}>
        <div className={styles.sectionTitle}>Configurações</div>
        <div className={styles.configFilters}>
          <div className={styles.inputWrapper} style={{ maxWidth: "150px" }}>
            <label>Cód. Config</label>
            <input type="text" placeholder="Código" />
          </div>
          <div className={styles.inputWrapper} style={{ maxWidth: "250px" }}>
            <label>Descrição</label>
            <input type="text" placeholder="Descrição" />
          </div>
          <button className={`${styles.btn} ${styles.btnBlue}`}>
            Buscar <FiSearch />
          </button>
        </div>

        <div className={styles.innerTableContainer}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Cod. Config</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((conf) => (
                <tr key={conf.id}>
                  <td>{conf.cod}</td>
                  <td>{conf.descricao}</td>
                  <td>{conf.valor}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        conf.status
                          ? styles.statusActive
                          : styles.statusInactive
                      }`}
                    >
                      {conf.status ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnBlue}`}
                      style={{
                        padding: "4px 12px",
                        minWidth: "auto",
                        fontSize: "12px",
                      }}
                      onClick={() => handleEditConfig(conf)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={1}
          totalElementos={configs.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
