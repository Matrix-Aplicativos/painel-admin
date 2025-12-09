"use client";

import { useState } from "react";
import styles from "./ModalNovaEmpresa.module.css";
import { FiX, FiCheck, FiSearch } from "react-icons/fi";
import ModalMunicipio from "./ModalMunicipio";

interface ModalNovaEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ModalNovaEmpresa({
  isOpen,
  onClose,
  onSave,
}: ModalNovaEmpresaProps) {
  const [isMunicipioOpen, setIsMunicipioOpen] = useState(false);

  const [formData, setFormData] = useState({
    razao: "",
    fantasia: "",
    cnpj: "",
    codErp: "",
    cidade: "",
    bairro: "",
    movix: true,
    fdv: false,
    maxDispositivos: 10,
    maxMulti: 5,
    validade: "",
    diaBoleto: 10,
  });

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let finalValue: any = value;

    if (type === "checkbox") {
      finalValue = checked;
    } else if (name === "cnpj") {
      finalValue = maskCNPJ(value);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleCidadeSelect = (cidadeCompleta: string) => {
    setFormData((prev) => ({ ...prev, cidade: cidadeCompleta }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalMunicipio
        isOpen={isMunicipioOpen}
        onClose={() => setIsMunicipioOpen(false)}
        onSelect={handleCidadeSelect}
      />

      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>NOVA EMPRESA</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.sectionTitle}>Dados de Cadastro</div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Razão Social</label>
                <input
                  name="razao"
                  type="text"
                  placeholder="Razão Social"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Nome Fantasia</label>
                <input
                  name="fantasia"
                  type="text"
                  placeholder="Fantasia"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>CNPJ</label>
                <input
                  name="cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Cód. ERP</label>
                <input
                  name="codErp"
                  type="text"
                  placeholder="Código no ERP"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Cidade</label>
                <div className={styles.inputWrapperRelative}>
                  <input
                    name="cidade"
                    type="text"
                    placeholder="Selecione..."
                    value={formData.cidade}
                    readOnly
                    onClick={() => setIsMunicipioOpen(true)}
                  />
                  <FiSearch className={styles.searchIcon} size={16} />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Bairro</label>
                <input
                  name="bairro"
                  type="text"
                  placeholder="Bairro"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.productSection}>
              <div className={styles.toggleHeader}>
                <span className={styles.productTitle}>Movix</span>
                <label className={styles.switch}>
                  <input
                    name="movix"
                    type="checkbox"
                    checked={formData.movix}
                    onChange={handleChange}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.formRow} style={{ marginTop: "10px" }}>
                <div className={styles.inputGroup}>
                  <label>Máx. Disp.</label>
                  <input
                    name="maxDispositivos"
                    type="number"
                    defaultValue="10"
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx. Multi</label>
                  <input
                    name="maxMulti"
                    type="number"
                    defaultValue="5"
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Validade Lic.</label>
                  <input name="validade" type="date" onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Venc. Primeiro Boleto</label>
                  <input
                    name="diaBoleto"
                    type="number"
                    min="1"
                    max="31"
                    defaultValue="10"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.productSection}>
              <div className={styles.toggleHeader}>
                <span className={styles.productTitle}>Força de Vendas</span>
                <label className={styles.switch}>
                  <input
                    name="fdv"
                    type="checkbox"
                    checked={formData.fdv}
                    onChange={handleChange}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "12px",
                  color: "#999",
                  fontStyle: "italic",
                }}
              >
                Sem configurações adicionais no momento.
              </div>
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.btnSave}>
                Salvar <FiCheck />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
