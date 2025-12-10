"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "@/app/img/Logo.png";

import "./Login.css";
import { useAuth } from "./src/hooks/useAuth";

export default function LoginPage() {
  const { login: loginAuth } = useAuth();
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [textoIdentificacao, setTextoIdentificacao] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!textoIdentificacao) return;
    const timer = setTimeout(() => {
      setTextoIdentificacao("");
      setTipoMensagem("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [textoIdentificacao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTextoIdentificacao("");

    if (!login || !senha) {
      setTextoIdentificacao("Preencha login e senha.");
      setTipoMensagem("erro");
      setLoading(false);
      return;
    }

    const result = await loginAuth({ login, senha });

    if (result.success) {
      router.push("/painel");
    } else {
      const msg = result.error || "Erro ao realizar login.";
      setTextoIdentificacao(msg);
      setTipoMensagem("erro");
    }

    setLoading(false);
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

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              id="login"
              type="text"
              placeholder="Digite seu login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="login">Login</label>
          </div>

          <div className="input-field senha-container">
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              maxLength={50}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="senha">Senha</label>
            <span
              className="eye-icon"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

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
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Todos direitos reservados</p>
      </footer>
    </div>
  );
}
