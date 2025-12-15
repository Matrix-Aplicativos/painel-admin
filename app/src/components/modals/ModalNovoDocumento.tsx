import React, { useState, useRef } from "react";
import { FiX, FiCheck, FiUpload } from "react-icons/fi";
import { FaLaptop } from "react-icons/fa";
import "./ModalNovoDocumento.css"; // Importação do CSS separado

interface ModalNovoDocumentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nome: string, arquivo: File) => Promise<void>;
  loading: boolean;
}

export default function ModalNovoDocumento({
  isOpen,
  onClose,
  onSave,
  loading,
}: ModalNovoDocumentoProps) {
  const [nome, setNome] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!nome || !arquivo) {
      alert("Preencha o nome e selecione um arquivo.");
      return;
    }
    onSave(nome, arquivo);
  };

  // Define classes dinâmicas para a dropzone
  const dropzoneClass = `dropzone ${dragActive ? "dropzoneActive" : ""} ${
    arquivo ? "dropzoneFilled" : ""
  }`;

  return (
    <div className="overlay">
      <div className="modal">
        {/* Header */}
        <div className="header">
          <h2 className="title">Novo Documento</h2>
          <button onClick={onClose} className="closeButton">
            <FiX size={24} color="#666" />
          </button>
        </div>

        {/* Input Nome */}
        <div className="inputGroup">
          <label className="label">Nome do Arquivo</label>
          <input
            type="text"
            placeholder="Ex: Contrato Social"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input"
          />
        </div>

        {/* Área de Upload */}
        <div
          className={dropzoneClass}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClickUpload}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {arquivo ? (
            <div className="fileInfo">
              <FiCheck size={40} color="#2ecc71" style={{ marginBottom: 10 }} />
              <p className="fileName">{arquivo.name}</p>
              <p className="fileChange">Clique para alterar</p>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div className="iconContainer">
                <FaLaptop size={30} color="#999" />
                <div className="uploadArrow">
                  <FiUpload size={14} color="#fff" />
                </div>
              </div>
              <p className="uploadTextMain">Selecione ou arraste o arquivo</p>
              <p className="uploadTextSub">Formatos Aceitos (PDF)</p>
            </div>
          )}
        </div>

        {/* Botão Salvar */}
        <div className="footer">
          <button onClick={handleSubmit} disabled={loading} className="btnSave">
            {loading ? (
              "Salvando..."
            ) : (
              <>
                Salvar <FiCheck style={{ marginLeft: 5 }} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
