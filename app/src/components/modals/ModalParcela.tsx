"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ModalParcela.module.css";
import { FiChevronLeft, FiCheck, FiCalendar } from "react-icons/fi";

interface ParcelaData {
  codparcela?: number;
  numparcela: string | number;
  valor: string | number;
  datavencimento: string;
  tipo: string;
  datapagamento: string;
  pago: boolean; // Adicionado para controle visual, se precisar
}

interface ModalParcelaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ParcelaData) => void;
  initialData?: any; // Pode vir do banco
}

export default function ModalParcela({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModalParcelaProps) {
  const vencimentoRef = useRef<HTMLInputElement>(null);
  const pagamentoRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ParcelaData>({
    numparcela: "",
    valor: "",
    datavencimento: "",
    tipo: "",
    datapagamento: "",
    pago: false,
  });

  // Função auxiliar para formatar data YYYY-MM-DD -> DD/MM/AAAA
  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          codparcela: initialData.codparcela,
          numparcela: initialData.numparcela,
          valor: (initialData.valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          datavencimento: formatDateDisplay(initialData.datavencimento),
          tipo: initialData.tipo,
          datapagamento: formatDateDisplay(initialData.datapagamento),
          pago: initialData.pago || false,
        });
      } else {
        setFormData({
          numparcela: "",
          valor: "",
          datavencimento: "",
          tipo: "",
          datapagamento: "",
          pago: false,
        });
      }
    }
  }, [isOpen, initialData]);

  // --- MÁSCARAS ---
  const maskCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";
    const numberValue = Number(cleanValue) / 100;
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const maskDate = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 8);
    if (v.length >= 5) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return v;
  };

  // --- HANDLERS ---
  const abrirCalendario = (ref: React.RefObject<HTMLInputElement>) => {
    try {
      if (ref.current) {
        // @ts-ignore
        if (ref.current.showPicker) ref.current.showPicker();
        else {
          ref.current.focus();
          ref.current.click();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDatePickerChange = (dateValue: string, fieldName: string) => {
    if (!dateValue) return;
    const [year, month, day] = dateValue.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    setFormData((prev) => ({ ...prev, [fieldName]: formattedDate }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, valor: maskCurrency(e.target.value) }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: maskDate(e.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose} type="button">
            <FiChevronLeft />
          </button>
          <h2 className={styles.title}>
            {initialData ? "EDITAR PARCELA" : "NOVA PARCELA"}
          </h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nº Parcela */}
          <div className={styles.inputGroup}>
            <label>Nº da Parcela</label>
            <input
              name="numparcela"
              type="number"
              placeholder="1"
              value={formData.numparcela}
              onChange={handleChange}
              required
            />
          </div>

          {/* Valor */}
          <div className={styles.inputGroup}>
            <label>Valor</label>
            <input
              name="valor"
              type="text"
              placeholder="R$ 0,00"
              value={formData.valor}
              onChange={handleCurrencyChange}
              required
            />
          </div>

          {/* Vencimento */}
          <div className={styles.inputGroup}>
            <label>Data Vencimento</label>
            <div className={styles.dateWrapper}>
              <input
                name="datavencimento"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formData.datavencimento}
                onChange={handleDateChange}
                maxLength={10}
                required
              />
              <FiCalendar
                className={styles.calendarIcon}
                size={18}
                onClick={() => abrirCalendario(vencimentoRef)}
              />
              <input
                type="date"
                ref={vencimentoRef}
                className={styles.hiddenDatePicker}
                onChange={(e) =>
                  handleDatePickerChange(e.target.value, "datavencimento")
                }
              />
            </div>
          </div>

          {/* Tipo */}
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="A">Ativação</option>
              <option value="M">Manutenção</option>
              <option value="S">Serviço</option>
              <option value="O">Outros</option>
            </select>
          </div>

          {/* Pagamento (Opcional) */}
          <div className={styles.inputGroup}>
            <label>Data Pagamento</label>
            <div className={styles.dateWrapper}>
              <input
                name="datapagamento"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formData.datapagamento}
                onChange={handleDateChange}
                maxLength={10}
              />
              <FiCalendar
                className={styles.calendarIcon}
                size={18}
                onClick={() => abrirCalendario(pagamentoRef)}
              />
              <input
                type="date"
                ref={pagamentoRef}
                className={styles.hiddenDatePicker}
                onChange={(e) =>
                  handleDatePickerChange(e.target.value, "datapagamento")
                }
              />
            </div>
          </div>

          <button type="submit" className={styles.btnSave}>
            Salvar <FiCheck />
          </button>
        </form>
      </div>
    </div>
  );
}
