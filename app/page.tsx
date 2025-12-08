"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "@/app/img/Logo.png";

import "./Login.css";

export default function LoginPage() {
  const [definirPrimeiraSenha, setDefinirPrimeiraSenha] = useState(false);
  const [modoEsqueciSenha, setModoEsqueciSenha] = useState(false);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [textoIdentificacao, setTextoIdentificacao] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "">("");
  const [forcaSenha, setForcaSenha] = useState(0);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!textoIdentificacao) return;
    const timer = setTimeout(() => {
      setTextoIdentificacao("");
      setTipoMensagem("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [textoIdentificacao]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTextoIdentificacao("");
    setTipoMensagem("");
  }, [modoEsqueciSenha, definirPrimeiraSenha]);

  const verificarForcaSenha = (valor: string) => {
    if (valor.length < 6) return 1;
    let forca = 0;
    if (/[A-Z]/.test(valor)) forca++;
    if (/[a-z]/.test(valor)) forca++;
    if (/[0-9]/.test(valor)) forca++;
    if (/[^A-Za-z0-9]/.test(valor)) forca++;
    if (forca <= 1) return 1;
    if (forca === 2 || forca === 3) return 2;
    return 3;
  };

  const handleDefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmacaoSenha) {
      setTextoIdentificacao("As senhas não coincidem.");
      setTipoMensagem("erro");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setTextoIdentificacao(
        "Senha definida com sucesso! Faça login novamente."
      );
      setTipoMensagem("sucesso");
      setDefinirPrimeiraSenha(false);
      setSenha("");
      setConfirmacaoSenha("");
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (modoEsqueciSenha) {
        if (!login) {
          setTextoIdentificacao("Digite seu login para continuar");
          setTipoMensagem("erro");
        } else {
          setTextoIdentificacao(
            "Solicitação enviada! Verifique seu email (Simulação)."
          );
          setTipoMensagem("sucesso");
          setModoEsqueciSenha(false);
        }
      } else {
        if (login && senha) {
          console.log("Login efetuado com:", login, senha);
          router.push("/painel");
        } else {
          setTextoIdentificacao("Preencha login e senha.");
          setTipoMensagem("erro");
        }
      }
      setLoading(false);
    }, 1000);
  };

  const handleVoltar = () => {
    setModoEsqueciSenha(false);
    setDefinirPrimeiraSenha(false);
    setSenha("");
    setConfirmacaoSenha("");
    setLogin("");
  };

  return (
    <div className="container">
      <div className="content">
        <div className="logo-container">
          <Image
            src={Logo}
            alt="Logo"
            width={220}
            height={200}
            priority
            unoptimized
          />
        </div>

        <h5 className="heading">Painel ADM Matrix</h5>

        <form
          className="login-form"
          onSubmit={definirPrimeiraSenha ? handleDefinirSenha : handleSubmit}
        >
          <div className="input-field">
            <input
              id="login"
              type="text"
              placeholder="Digite seu login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              disabled={definirPrimeiraSenha}
            />
            <label htmlFor="login">Login</label>
          </div>

          {!modoEsqueciSenha && (
            <div className="input-field senha-container">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder={
                  definirPrimeiraSenha
                    ? "Digite sua nova senha"
                    : "Digite sua senha"
                }
                value={senha}
                maxLength={50}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (definirPrimeiraSenha) {
                    setForcaSenha(verificarForcaSenha(e.target.value));
                  }
                }}
              />
              <label htmlFor="senha">
                {definirPrimeiraSenha ? "Nova Senha" : "Senha"}
              </label>
              <span
                className="eye-icon"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}
          {definirPrimeiraSenha && senha && (
            <>
              <div
                style={{
                  height: "5px",
                  borderRadius: "2.5px",
                  marginTop: "-30px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "2.5px",
                    transition:
                      "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
                    backgroundColor:
                      forcaSenha >= 3
                        ? "green"
                        : forcaSenha >= 2
                        ? "orange"
                        : "red",
                    width: `${forcaSenha * 33.3333}%`,
                  }}
                ></div>
              </div>
              <p
                style={{
                  textAlign: "left",
                  fontSize: "0.8rem",
                  color:
                    forcaSenha >= 3
                      ? "green"
                      : forcaSenha >= 2
                      ? "orange"
                      : "red",
                  marginBottom: "40px",
                }}
              >
                {forcaSenha >= 3
                  ? "Forte"
                  : forcaSenha >= 2
                  ? "Moderado"
                  : "Fraca"}
              </p>
            </>
          )}

          {definirPrimeiraSenha && (
            <div className="input-field senha-container">
              <input
                id="confirmacaoSenha"
                type={mostrarConfirmacao ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                value={confirmacaoSenha}
                maxLength={50}
                onChange={(e) => setConfirmacaoSenha(e.target.value)}
              />
              <label htmlFor="confirmacaoSenha">Confirmar Senha</label>
              <span
                className="eye-icon"
                onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
              >
                {mostrarConfirmacao ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          {!definirPrimeiraSenha && !modoEsqueciSenha && (
            <p
              style={{
                color: "#007bff",
                cursor: "pointer",
                textAlign: "center",
              }}
              onClick={() => setModoEsqueciSenha(true)}
            >
              Esqueceu sua senha?
            </p>
          )}

          {textoIdentificacao && (
            <p
              style={{
                textAlign: "center",
                margin: "10px 0",
                color: tipoMensagem === "sucesso" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {textoIdentificacao}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "7px" }}>
            <button
              type="submit"
              className="action-button enviar"
              disabled={loading}
            >
              {loading
                ? "Processando..."
                : modoEsqueciSenha
                ? "Enviar"
                : definirPrimeiraSenha
                ? "Definir Senha"
                : "Entrar"}
            </button>
            {(modoEsqueciSenha || definirPrimeiraSenha) && (
              <button
                type="button"
                className="action-button voltar"
                onClick={handleVoltar}
              >
                Voltar
              </button>
            )}
          </div>
        </form>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Todos direitos reservados</p>
      </footer>
    </div>
  );
}
