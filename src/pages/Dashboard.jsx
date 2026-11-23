import { useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();

    function sair() {
        logout();
        navigate("/login");
    }

    const modulos = [
        {
            titulo: "Animais",
            descricao: "Cadastre e gerencie os animais.",
            rota: "/animais",
            icone: "🐾",
        },
        {
            titulo: "Categorias",
            descricao: "Organize os animais por categoria.",
            rota: "/categorias",
            icone: "📂",
        },
        {
            titulo: "Vacinas",
            descricao: "Gerencie o catálogo de vacinas.",
            rota: "/vacinas",
            icone: "💉",
        },
        {
            titulo: "Histórico de vacinação",
            descricao: "Acompanhe as vacinas aplicadas.",
            rota: "/vacinacao",
            icone: "📋",
        },
    ];

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <h2>Conexão Pet</h2>
                <p className="sidebar-subtitulo">Painel administrativo</p>

                <nav>
                    <button
                        className="menu-item ativo"
                        onClick={() => navigate("/")}
                    >
                        Início
                    </button>

                    {modulos.map((modulo) => (
                        <button
                            className="menu-item"
                            key={modulo.rota}
                            onClick={() => navigate(modulo.rota)}
                        >
                            {modulo.icone} {modulo.titulo}
                        </button>
                    ))}
                </nav>

                <button className="botao-sair" onClick={sair}>
                    Sair
                </button>
            </aside>

            <main className="dashboard-conteudo">
                <header className="dashboard-header">
                    <div>
                        <h1>Bem-vindo ao Conexão Pet!</h1>
                        <p>Gerencie os animais e suas informações.</p>
                    </div>
                </header>

                <section className="dashboard-cards">
                    {modulos.map((modulo) => (
                        <article className="dashboard-card" key={modulo.rota}>
                            <span className="card-icone">{modulo.icone}</span>
                            <h3>{modulo.titulo}</h3>
                            <p>{modulo.descricao}</p>
                            <button onClick={() => navigate(modulo.rota)}>
                                Acessar
                            </button>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}
