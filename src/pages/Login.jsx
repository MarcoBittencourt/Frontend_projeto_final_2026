
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            await login(email, senha);
            navigate("/");
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="login-container">

            <div className="login-decor decor-top"></div>
            <div className="login-decor decor-bottom"></div>

            <div className="login-card">

                {/* Painel de identidade */}
                <section className="login-brand">

                    <div className="brand-logo">
                        <svg viewBox="0 0 100 100" fill="none">
                            <path
                                d="M20 45V77C20 80 23 82 26 81L50 72L74 81C77 82 80 80 80 77V45"
                                stroke="currentColor"
                                strokeWidth="5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M12 46L50 13L88 46"
                                stroke="currentColor"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="50" cy="43" r="7" fill="currentColor"/>
                            <circle cx="38" cy="34" r="5" fill="currentColor"/>
                            <circle cx="62" cy="34" r="5" fill="currentColor"/>
                            <circle cx="33" cy="46" r="5" fill="currentColor"/>
                            <circle cx="67" cy="46" r="5" fill="currentColor"/>
                        </svg>
                    </div>

                    <h2>
                        Conexão
                        <span>Pet</span>
                    </h2>

                    <p className="brand-description">
                        Adote. Cuide. Faça a diferença.
                    </p>

                    <div className="brand-animals">
                        <span className="animal-dog">🐶</span>
                        <span className="animal-cat">🐱</span>
                        <span className="animal-heart">♡</span>
                    </div>

                    <p className="brand-message">
                        Todo animal merece um lar cheio de amor.
                    </p>

                </section>

                {/* Formulário de login */}
                <section className="login-content">

                    <div className="login-header">
                        <h1>Entrar</h1>
                        <p>Acesse sua conta para continuar</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>

                        <label htmlFor="email">E-mail</label>

                        <div className="login-input-group">
                            <span className="input-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="5" width="18" height="14" rx="3"
                                          stroke="currentColor" strokeWidth="2"/>
                                    <path d="M4 7L12 13L20 7"
                                          stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round"/>
                                </svg>
                            </span>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <label htmlFor="senha">Senha</label>

                        <div className="login-input-group">
                            <span className="input-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <rect x="5" y="10" width="14" height="11" rx="2"
                                          stroke="currentColor" strokeWidth="2"/>
                                    <path d="M8 10V7a4 4 0 018 0v3"
                                          stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round"/>
                                    <circle cx="12" cy="15" r="1.5"
                                            fill="currentColor"/>
                                </svg>
                            </span>

                            <input
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Sua senha"
                                required
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {mostrarSenha ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>

                        {erro && (
                            <p className="login-erro">{erro}</p>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={carregando}
                        >
                            {carregando ? "Entrando..." : "Entrar"}
                            {!carregando && <span>→</span>}
                        </button>

                        <div className="login-divider">
                            <span></span>
                            <p>ou</p>
                            <span></span>
                        </div>

                        <p className="login-cadastro">
                            Não tem conta?
                            <a href="/cadastro">Cadastre-se</a>
                        </p>

                    </form>

                </section>

            </div>
        </main>
    );
}
