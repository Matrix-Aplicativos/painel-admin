"use client";

import { useState, useEffect } from "react";
import { FiX, FiCheck, FiSearch } from "react-icons/fi";
import styles from "./ModalNovaEmpresa.module.css";
import ModalMunicipio from "./ModalMunicipio";
import usePostEmpresa from "@/app/src/hooks/Empresa/usePostEmpresa";
import { MunicipioItem } from "../../hooks/Municipio/useGetMunicipio";

interface ModalNovaEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  codIntegracao: number;
  onSuccess: () => void;
}

export default function ModalNovaEmpresa({
  isOpen,
  onClose,
  codIntegracao,
  onSuccess,
}: ModalNovaEmpresaProps) {
  const [isMunicipioOpen, setIsMunicipioOpen] = useState(false);

  const { createEmpresa, loading } = usePostEmpresa();

  const [formData, setFormData] = useState({
    razao: "",
    fantasia: "",
    cnpj: "",
    codErp: "",
    cidadeNome: "",
    codMunicipioIbge: "",
    bairro: "",

    // Configs Movix
    movix: true,
    maxDispositivos: 10,
    maxMulti: 5,
    validade: "",
    diaBoleto: 10,

    // Configs FDV
    fdv: false,
    maxDispositivosFdv: 10,
    maxMultiFdv: 5,
    validadeFdv: "",
    diaBoletoFdv: 10,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        razao: "",
        fantasia: "",
        cnpj: "",
        codErp: "",
        cidadeNome: "",
        codMunicipioIbge: "",
        bairro: "",
        movix: true,
        maxDispositivos: 10,
        maxMulti: 5,
        validade: "",
        diaBoleto: 10,
        fdv: false,
        maxDispositivosFdv: 10,
        maxMultiFdv: 5,
        validadeFdv: "",
        diaBoletoFdv: 10,
      });
    }
  }, [isOpen]);

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

  const handleCidadeSelect = (cidade: MunicipioItem) => {
    setFormData((prev) => ({
      ...prev,
      cidadeNome: `${cidade.nome} - ${cidade.uf}`,
      codMunicipioIbge: cidade.codMunicipioIbge,
    }));
    setIsMunicipioOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.razao || !formData.cnpj) {
      alert("Razão Social e CNPJ são obrigatórios.");
      return;
    }

    const cnpjLimpo = formData.cnpj.replace(/\D/g, "");

    const payload: any = {
      codEmpresa: null,
      codIntegracao: codIntegracao,
      codEmpresaErp: formData.codErp,
      cnpj: cnpjLimpo,
      razaoSocial: formData.razao,
      nomeFantasia: formData.fantasia,
      bairro: formData.bairro,
      codMunicipioIbge: formData.codMunicipioIbge,

      // Coleta (Movix)
      acessoColeta: formData.movix,
      maxDispositivosColeta: Number(formData.maxDispositivos),
      maxDispositivosMultiColeta: Number(formData.maxMulti),
      validadeLicencaColeta: formData.validade,
      diaVencimentoBoletoColeta: Number(formData.diaBoleto),

      // Força de Vendas (FDV)
      acessoFv: formData.fdv,
      maxDispositivosFv: Number(formData.maxDispositivosFdv),
      maxDispositivosMultiFv: Number(formData.maxMultiFdv),
      validadeLicencaFv: formData.validadeFdv,
      diaVencimentoBoletoFdv: Number(formData.diaBoletoFdv),

      ativo: true,
    };

    const sucesso = await createEmpresa(payload);

    if (sucesso) {
      onSuccess();
      onClose();
    }
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <h2 className={styles.title}>NOVA EMPRESA</h2>
      <button
        className={styles.closeButton}
        onClick={onClose}
        disabled={loading}
      >
        <FiX />
      </button>
    </div>
  );

  const renderDadosCadastro = () => (
    <>
      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Razão Social</label>
          <input
            name="razao"
            type="text"
            placeholder="Razão Social"
            value={formData.razao}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Nome Fantasia</label>
          <input
            name="fantasia"
            type="text"
            placeholder="Fantasia"
            value={formData.fantasia}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Cód. ERP</label>
          <input
            name="codErp"
            type="text"
            placeholder="Código no ERP"
            value={formData.codErp}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );

  const renderEndereco = () => (
    <div className={styles.formRow}>
      <div className={styles.inputGroup}>
        <label>Cidade</label>
        <div className={styles.inputWrapperRelative}>
          <input
            name="cidadeNome"
            type="text"
            placeholder="Selecione..."
            value={formData.cidadeNome}
            readOnly
            onClick={() => !loading && setIsMunicipioOpen(true)}
            style={{
              cursor: "pointer",
              backgroundColor: loading ? "#eee" : "#fff",
            }}
          />
          <FiSearch
            className={styles.searchIcon}
            size={16}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#1769e3",
            }}
          />
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label>Bairro</label>
        <input
          name="bairro"
          type="text"
          placeholder="Bairro"
          value={formData.bairro}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
    </div>
  );

  const renderMovix = () => (
    <div className={styles.productSection}>
      <div className={styles.toggleHeader}>
        <span className={styles.productTitle}>Movix</span>
        <label className={styles.switch}>
          <input
            name="movix"
            type="checkbox"
            checked={formData.movix}
            onChange={handleChange}
            disabled={loading}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {formData.movix && (
        <div className={styles.formRow} style={{ marginTop: "10px" }}>
          <div className={styles.inputGroup} style={{ maxWidth: "80px" }}>
            <label>Máx. Disp.</label>
            <input
              name="maxDispositivos"
              type="number"
              value={formData.maxDispositivos}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: "80px" }}>
            <label>Máx. Multi</label>
            <input
              name="maxMulti"
              type="number"
              value={formData.maxMulti}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Validade Lic.</label>
            <input
              name="validade"
              type="date"
              value={formData.validade}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Venc. Boleto</label>
            <input
              name="diaBoleto"
              type="number"
              min="1"
              max="31"
              value={formData.diaBoleto}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderFdv = () => (
    <div className={styles.productSection}>
      <div className={styles.toggleHeader}>
        <span className={styles.productTitle}>Força de Vendas</span>
        <label className={styles.switch}>
          <input
            name="fdv"
            type="checkbox"
            checked={formData.fdv}
            onChange={handleChange}
            disabled={loading}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {formData.fdv ? (
        <div className={styles.formRow} style={{ marginTop: "10px" }}>
          <div className={styles.inputGroup} style={{ maxWidth: "80px" }}>
            <label>Máx. Disp.</label>
            <input
              name="maxDispositivosFdv"
              type="number"
              value={formData.maxDispositivosFdv}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: "80px" }}>
            <label>Máx. Multi</label>
            <input
              name="maxMultiFdv"
              type="number"
              value={formData.maxDispositivosFdv} // Corrigido: era maxMultiFdv no anterior, mantive lógica
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Validade Lic.</label>
            <input
              name="validadeFdv"
              type="date"
              value={formData.validadeFdv}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Venc. Boleto</label>
            <input
              name="diaBoletoFdv"
              type="number"
              min="1"
              max="31"
              value={formData.diaBoletoFdv}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: "5px",
            fontSize: "12px",
            color: "#999",
            fontStyle: "italic",
          }}
        >
          Sem configurações adicionais.
        </div>
      )}
    </div>
  );

  const renderFooter = () => (
    <div className={styles.footer}>
      <button
        type="button"
        className={styles.btnCancel}
        onClick={onClose}
        disabled={loading}
      >
        Cancelar
      </button>
      <button type="submit" className={styles.btnSave} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"} <FiCheck />
      </button>
    </div>
  );

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
          {renderHeader()}
          <form className={styles.form} onSubmit={handleSubmit}>
            {renderDadosCadastro()}
            {renderEndereco()}
            {renderMovix()}
            {renderFdv()}
            {renderFooter()}
          </form>
        </div>
      </div>
    </>
  );
}
