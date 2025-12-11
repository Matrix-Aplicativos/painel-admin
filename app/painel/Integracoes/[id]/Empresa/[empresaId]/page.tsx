"use client";

import styles from "./DetalhesEmpresa.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiSearch,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ModalEditConfig from "@/app/src/components/modals/ModalEditConfig";
import ModalMunicipio from "@/app/src/components/modals/ModalMunicipio";

// Hooks
import useGetEmpresaById, {
  EmpresaDetalhe,
} from "@/app/src/hooks/Empresa/useGetEmpresaById";
import useDeleteEmpresa from "@/app/src/hooks/Empresa/useDeleteEmpresa";
import usePostEmpresa, {
  EmpresaPayload,
} from "@/app/src/hooks/Empresa/usePostEmpresa";
import useGetConfigMovix from "@/app/src/hooks/Configuracao/useGetConfigMovix";
import useGetConfigFdv from "@/app/src/hooks/Configuracao/useGetConfigFdv";
import { MunicipioItem } from "@/app/src/hooks/Geral/useGetMunicipio";

interface EmpresaPayloadExtended extends EmpresaPayload {
  diaVencimentoBoleto?: number;
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const empresaId = Number(params.empresaId);
  const integracaoId = params.id;

  // --- HOOKS ---
  const {
    empresa,
    loading,
    error,
    refetch: refetchEmpresa,
  } = useGetEmpresaById(empresaId);
  const { deleteEmpresa, loading: loadingDelete } = useDeleteEmpresa();
  const { createEmpresa, loading: loadingSave } = usePostEmpresa();

  const { configuracoes: configsMovix } = useGetConfigMovix({
    codEmpresa: empresaId,
    pagina: 1,
    porPagina: 100,
  });

  const { configuracoes: configsFdv } = useGetConfigFdv({
    codEmpresa: empresaId,
    pagina: 1,
    porPagina: 100,
  });

  // --- ESTADOS ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EmpresaPayloadExtended>>({});

  const [cidadeNomeDisplay, setCidadeNomeDisplay] = useState("");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  const [isModalConfigOpen, setIsModalConfigOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [tipoConfig, setTipoConfig] = useState<"MOVIX" | "FDV">("MOVIX");

  // --- EFEITO: CARREGAR DADOS ---
  useEffect(() => {
    if (empresa) {
      setFormData({
        codEmpresa: empresa.codEmpresa,
        codIntegracao: empresa.codIntegracao,
        codEmpresaErp: empresa.codEmpresaErp,
        cnpj: empresa.cnpj,
        razaoSocial: empresa.razaoSocial,
        nomeFantasia: empresa.nomeFantasia,
        bairro: empresa.bairro,
        codMunicipioIbge: empresa.municipio?.codMunicipioIbge,
        acessoColeta: empresa.acessoColeta,
        acessoFv: empresa.acessoFdv,
        maxDispositivosColeta: empresa.maxDispositivosColeta,
        maxDispositivosMultiColeta: empresa.maxDispositivosMultiColeta,
        validadeLicencaColeta: empresa.validadeLicencaColeta,
        maxDispositivosFv: empresa.maxDispositivosFdv,
        maxDispositivosMultiFv: empresa.maxDispositivosMultiFdv,
        validadeLicencaFv: empresa.validadeLicencaFdv,
        ativo: empresa.ativo,
        // diaVencimentoBoleto: empresa.diaVencimentoBoleto
      });

      if (empresa.municipio) {
        setCidadeNomeDisplay(
          `${empresa.municipio.nome} - ${empresa.municipio.uf}`
        );
      }
    }
  }, [empresa]);

  // --- HANDLERS ---

  const handleInputChange = (
    field: keyof EmpresaPayloadExtended,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectCity = (cidade: MunicipioItem) => {
    handleInputChange("codMunicipioIbge", cidade.codMunicipioIbge);
    setCidadeNomeDisplay(`${cidade.nome} - ${cidade.uf}`);
    setIsCityModalOpen(false);
  };

  const handleEditar = () => setIsEditing(true);

  const handleCancelarEdicao = () => {
    setIsEditing(false);
    refetchEmpresa();
  };

  const handleSalvarEdicao = async () => {
    if (!formData.razaoSocial || !formData.cnpj) {
      alert("Razão Social e CNPJ são obrigatórios.");
      return;
    }
    const sucesso = await createEmpresa(formData as EmpresaPayload);
    if (sucesso) {
      alert("Empresa salva com sucesso!");
      setIsEditing(false);
      refetchEmpresa();
    }
  };

  const handleExcluir = async () => {
    if (confirm("Deseja realmente excluir esta empresa?")) {
      const sucesso = await deleteEmpresa(empresaId);
      if (sucesso) {
        alert("Empresa excluída!");
        router.push(`/painel/Integracoes/${integracaoId}`);
      }
    }
  };

  const handleEditConfig = (config: any, tipo: "MOVIX" | "FDV") => {
    setSelectedConfig(config);
    setTipoConfig(tipo);
    setIsModalConfigOpen(true);
  };

  const handleSaveConfigModal = () => {
    // A função de sucesso apenas fecha o modal e recarrega a página/lista
    // O modal já cuida do PUT
    setIsModalConfigOpen(false);
    // Idealmente chamaríamos refetchConfigs aqui, mas os hooks de config não retornam refetch ainda
    // Se precisar, adicione refetch no hook de config e chame aqui.
    console.log("Config salva!");
  };

  if (loading)
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
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
      <ModalMunicipio
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSelect={handleSelectCity}
      />

      <ModalEditConfig
        isOpen={isModalConfigOpen}
        onClose={() => setIsModalConfigOpen(false)}
        onSaveSuccess={handleSaveConfigModal} // Atualizado para onSaveSuccess
        data={selectedConfig}
        tipo={tipoConfig} // Atualizado para receber tipo
      />

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{empresa.razaoSocial?.toUpperCase()}</h1>
          <span
            className={`${styles.statusBadge} ${
              empresa.ativo ? styles.statusActive : styles.statusInactive
            }`}
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
                Excluir <FiTrash2 />
              </button>
            </div>
          ) : (
            <div className={styles.buttonRow}>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={handleSalvarEdicao}
                disabled={loadingSave}
              >
                Salvar <FiCheck />
              </button>
              <button
                className={`${styles.btn} ${styles.btnRed}`}
                onClick={handleCancelarEdicao}
                disabled={loadingSave}
              >
                Cancelar <FiX />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DADOS GERAIS */}
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
            <input
              type="text"
              value={formData.cnpj || ""}
              onChange={(e) => handleInputChange("cnpj", e.target.value)}
              disabled={!isEditing}
            />
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

          {/* INPUT CIDADE COM LUPA INTERNA */}
          <div className={styles.inputWrapper}>
            <label>Cidade / UF</label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                value={cidadeNomeDisplay}
                disabled
                readOnly
                style={{
                  backgroundColor: isEditing ? "#fff" : "#f9f9f9",
                  cursor: isEditing ? "default" : "not-allowed",
                }}
              />
              {isEditing && (
                <FiSearch
                  className={styles.searchIcon}
                  size={18}
                  onClick={() => setIsCityModalOpen(true)}
                />
              )}
            </div>
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

      {/* PERMISSÕES E LICENÇAS */}
      <div className={styles.formGroup}>
        <div className={styles.sectionTitle} style={{ marginTop: "20px" }}>
          Permissões e Licenças
        </div>

        <div className={styles.togglesRow}>
          <div
            className={styles.toggleContainer}
            style={{
              cursor: isEditing ? "pointer" : "default",
              opacity: isEditing ? 1 : 0.7,
            }}
            onClick={() =>
              isEditing &&
              handleInputChange("acessoColeta", !formData.acessoColeta)
            }
          >
            {formData.acessoColeta ? (
              <FiCheckSquare color="green" size={20} />
            ) : (
              <FiSquare size={20} />
            )}
            <span style={{ marginLeft: 8, fontWeight: 600 }}>
              Acesso Coleta
            </span>
          </div>

          <div
            className={styles.toggleContainer}
            style={{
              cursor: isEditing ? "pointer" : "default",
              opacity: isEditing ? 1 : 0.7,
            }}
            onClick={() =>
              isEditing && handleInputChange("acessoFv", !formData.acessoFv)
            }
          >
            {formData.acessoFv ? (
              <FiCheckSquare color="green" size={20} />
            ) : (
              <FiSquare size={20} />
            )}
            <span style={{ marginLeft: 8, fontWeight: 600 }}>
              Acesso Força de Vendas
            </span>
          </div>
        </div>

        {/* DETALHES MOVIX */}
        {formData.acessoColeta && (
          <div className={styles.subGroup}>
            <h4
              style={{ marginBottom: "10px", color: "#555", fontSize: "14px" }}
            >
              Detalhes Movix
            </h4>
            <div className={styles.inputRow}>
              <div className={styles.inputWrapper} style={{ width: "100px" }}>
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
              <div className={styles.inputWrapper} style={{ width: "100px" }}>
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
              <div className={styles.inputWrapper} style={{ width: "140px" }}>
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
              <div className={styles.inputWrapper} style={{ width: "120px" }}>
                <label>Dia Venc. Boleto</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.diaVencimentoBoleto || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "diaVencimentoBoleto",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        {/* DETALHES FDV */}
        {formData.acessoFv && (
          <div className={styles.subGroup}>
            <h4
              style={{ marginBottom: "10px", color: "#555", fontSize: "14px" }}
            >
              Detalhes Força de Vendas
            </h4>
            <div className={styles.inputRow}>
              <div className={styles.inputWrapper} style={{ width: "100px" }}>
                <label>Máx. Disp.</label>
                <input
                  type="number"
                  value={formData.maxDispositivosFv || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "maxDispositivosFv",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.inputWrapper} style={{ width: "100px" }}>
                <label>Máx. Multi</label>
                <input
                  type="number"
                  value={formData.maxDispositivosMultiFv || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "maxDispositivosMultiFv",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.inputWrapper} style={{ width: "140px" }}>
                <label>Validade Licença</label>
                <input
                  type="date"
                  value={
                    formData.validadeLicencaFv
                      ? String(formData.validadeLicencaFv).split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("validadeLicencaFv", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className={styles.inputWrapper} style={{ width: "120px" }}>
                <label>Dia Venc. Boleto</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.diaVencimentoBoleto || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "diaVencimentoBoleto",
                      Number(e.target.value)
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEÇÃO DE CONFIGURAÇÕES */}
      <div className={styles.configSection}>
        <div className={styles.sectionTitle}>Configurações</div>

        {/* Tabela MOVIX */}
        {configsMovix.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: 15, marginBottom: 10, color: "#1769e3" }}>
              Movix
            </h3>
            <div className={styles.innerTableContainer}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>Cód.</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th style={{ width: 100 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {configsMovix.map((conf) => (
                    <tr key={conf.codConfiguracao}>
                      <td>{conf.codConfiguracao}</td>
                      <td>{conf.descricao}</td>
                      <td>{conf.valor}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            conf.ativo
                              ? styles.statusActive
                              : styles.statusInactive
                          }`}
                        >
                          {conf.ativo ? "ATIVO" : "INATIVO"}
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
                          onClick={() => handleEditConfig(conf, "MOVIX")}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabela FDV */}
        {configsFdv.length > 0 && (
          <div>
            <h3 style={{ fontSize: 15, marginBottom: 10, color: "#1769e3" }}>
              Força de Vendas
            </h3>
            <div className={styles.innerTableContainer}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>Cód.</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th style={{ width: 100 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {configsFdv.map((conf) => (
                    <tr key={conf.codConfiguracao}>
                      <td>{conf.codConfiguracao}</td>
                      <td>{conf.descricao}</td>
                      <td>{conf.valor}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            conf.ativo
                              ? styles.statusActive
                              : styles.statusInactive
                          }`}
                        >
                          {conf.ativo ? "ATIVO" : "INATIVO"}
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
                          onClick={() => handleEditConfig(conf, "FDV")}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {configsMovix.length === 0 && configsFdv.length === 0 && (
          <p style={{ color: "#999", padding: 20, textAlign: "center" }}>
            Nenhuma configuração encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
