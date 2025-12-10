"use client";

import { useState, useEffect } from "react";
import styles from "./ModalEmpresas.module.css";
import { FiX, FiSave, FiCheckSquare, FiSquare, FiSearch } from "react-icons/fi";
import usePostEmpresa, {
  EmpresaPayload,
} from "@/app/src/hooks/Empresa/usePostEmpresa";
import ModalMunicipio from "./ModalMunicipio";
import { MunicipioItem } from "../../hooks/Municipio/useGetMunicipio";

interface ModalNovaEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  codIntegracao: number;
  onSuccess: () => void; 
}

const INITIAL_DATA: EmpresaPayload = {
  codEmpresa: null,
  codIntegracao: 0,
  codEmpresaErp: "",
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  bairro: "",
  codMunicipioIbge: "",
  acessoColeta: false,
  acessoFv: false,
  maxDispositivosColeta: 0,
  maxDispositivosMultiColeta: 0,
  validadeLicencaColeta: "",
  maxDispositivosFv: 0,
  maxDispositivosMultiFv: 0,
  validadeLicencaFv: "",
  ativo: true,
};

export default function ModalNovaEmpresa({
  isOpen,
  onClose,
  codIntegracao,
  onSuccess,
}: ModalNovaEmpresaProps) {
  const { createEmpresa, loading } = usePostEmpresa();
  const [formData, setFormData] = useState<EmpresaPayload>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<"geral" | "config">("geral");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [nomeCidadeSelecionada, setNomeCidadeSelecionada] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...INITIAL_DATA, codIntegracao: codIntegracao });
      setNomeCidadeSelecionada(""); 
    }
  }, [isOpen, codIntegracao]);

  const handleChange = (field: keyof EmpresaPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectCity = (cidade: MunicipioItem) => {
    handleChange("codMunicipioIbge", cidade.codMunicipioIbge);
    setNomeCidadeSelecionada(`${cidade.nome} - ${cidade.uf}`);

    setIsCityModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.razaoSocial || !formData.cnpj) {
      alert("Preencha Razão Social e CNPJ");
      return;
    }

    const sucesso = await createEmpresa(formData);

    if (sucesso) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>

      <ModalMunicipio
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSelect={handleSelectCity}
      />

      <div className={styles.container} style={{ maxWidth: "800px" }}>
        <div className={styles.header}>
          <h2 className={styles.title}>NOVA EMPRESA</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "geral" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("geral")}
          >
            Dados Gerais
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "config" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("config")}
          >
            Configurações e Licenças
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          {activeTab === "geral" && (
            <div className={styles.gridForm}>
              <div className={styles.inputGroup}>
                <label>Razão Social *</label>
                <input
                  type="text"
                  value={formData.razaoSocial}
                  onChange={(e) => handleChange("razaoSocial", e.target.value)}
                  required
                />
              </div>

              <div className={styles.rowTwo}>
                <div className={styles.inputGroup}>
                  <label>CNPJ *</label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => handleChange("cnpj", e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Fantasia</label>
                  <input
                    type="text"
                    value={formData.nomeFantasia}
                    onChange={(e) =>
                      handleChange("nomeFantasia", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.rowTwo}>
                <div className={styles.inputGroup}>
                  <label>Cód. ERP</label>
                  <input
                    type="text"
                    value={formData.codEmpresaErp}
                    onChange={(e) =>
                      handleChange("codEmpresaErp", e.target.value)
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Município (IBGE)</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={nomeCidadeSelecionada}
                      placeholder="Selecione a cidade"
                      readOnly 
                      style={{ cursor: "pointer", flex: 1 }}
                      onClick={() => setIsCityModalOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsCityModalOpen(true)}
                      style={{
                        background: "#eee",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                        padding: "0 10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FiSearch />
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Bairro</label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => handleChange("bairro", e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className={styles.gridForm}>
              <div className={styles.sectionBox}>
                <div
                  className={styles.checkTitle}
                  onClick={() =>
                    handleChange("acessoColeta", !formData.acessoColeta)
                  }
                >
                  {formData.acessoColeta ? (
                    <FiCheckSquare color="green" />
                  ) : (
                    <FiSquare />
                  )}
                  <span>Acesso Coleta</span>
                </div>

                {formData.acessoColeta && (
                  <div className={styles.subGrid}>
                    <div className={styles.inputGroup}>
                      <label>Max. Disp.</label>
                      <input
                        type="number"
                        value={formData.maxDispositivosColeta}
                        onChange={(e) =>
                          handleChange(
                            "maxDispositivosColeta",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Max. Multi</label>
                      <input
                        type="number"
                        value={formData.maxDispositivosMultiColeta}
                        onChange={(e) =>
                          handleChange(
                            "maxDispositivosMultiColeta",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Validade Licença</label>
                      <input
                        type="date"
                        value={
                          formData.validadeLicencaColeta
                            ? formData.validadeLicencaColeta.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleChange("validadeLicencaColeta", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.sectionBox}>
                <div
                  className={styles.checkTitle}
                  onClick={() => handleChange("acessoFv", !formData.acessoFv)}
                >
                  {formData.acessoFv ? (
                    <FiCheckSquare color="green" />
                  ) : (
                    <FiSquare />
                  )}
                  <span>Acesso Força de Vendas</span>
                </div>

                {formData.acessoFv && (
                  <div className={styles.subGrid}>
                    <div className={styles.inputGroup}>
                      <label>Max. Disp.</label>
                      <input
                        type="number"
                        value={formData.maxDispositivosFv}
                        onChange={(e) =>
                          handleChange(
                            "maxDispositivosFv",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Max. Multi</label>
                      <input
                        type="number"
                        value={formData.maxDispositivosMultiFv}
                        onChange={(e) =>
                          handleChange(
                            "maxDispositivosMultiFv",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Validade Licença</label>
                      <input
                        type="date"
                        value={
                          formData.validadeLicencaFv
                            ? formData.validadeLicencaFv.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleChange("validadeLicencaFv", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? "Salvando..." : "Salvar Empresa"} <FiSave />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
