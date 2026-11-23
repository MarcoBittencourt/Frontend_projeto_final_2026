import { useEffect, useState } from "react";
import {
    listarVacinas,
    cadastrarVacina,
    atualizarVacina,
    excluirVacina,
} from "../services/vacinaService";
import "./Vacinas.css";

export default function Vacinas() {
    const [vacinas, setVacinas] = useState([]);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [editando, setEditando] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        setVacinas(listarVacinas());
    }, []);

    function limparFormulario() {
        setNome("");
        setDescricao("");
        setEditando(null);
        setErro("");
    }

    function salvar(e) {
        e.preventDefault();
        setErro("");

        try {
            const dados = { nome, descricao };

            if (editando !== null) {
                atualizarVacina(editando, dados);
            } else {
                cadastrarVacina(dados);
            }

            setVacinas(listarVacinas());
            limparFormulario();
        } catch (error) {
            setErro(error.message);
        }
    }

    function editar(vacina) {
        setEditando(vacina.id);
        setNome(vacina.nome);
        setDescricao(vacina.descricao);
        setErro("");
    }

    function excluir(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir esta vacina?"
        );

        if (!confirmar) return;

        excluirVacina(id);
        setVacinas(listarVacinas());

        if (editando === id) {
            limparFormulario();
        }
    }

    return (
        <main className="vacinas-container">
            <header className="vacinas-header">
                <h1>Gerenciamento de vacinas</h1>
                <p>Cadastre e organize as vacinas utilizadas na plataforma.</p>
            </header>

            <section className="vacina-formulario">
                <h2>
                    {editando !== null ? "Editar vacina" : "Cadastrar vacina"}
                </h2>

                <form onSubmit={salvar}>
                    <label htmlFor="nome">Nome *</label>

                    <input
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        maxLength={40}
                        required
                        placeholder="Ex.: Antirrábica"
                    />

                    <label htmlFor="descricao">Descrição</label>

                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        maxLength={100}
                        placeholder="Descreva a vacina"
                    />

                    {erro && (
                        <p className="vacina-erro">{erro}</p>
                    )}

                    <div className="vacina-acoes">
                        <button type="submit">
                            {editando !== null
                                ? "Salvar alterações"
                                : "Cadastrar vacina"}
                        </button>

                        {editando !== null && (
                            <button
                                type="button"
                                className="vacina-cancelar"
                                onClick={limparFormulario}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="vacina-lista">
                <h2>Vacinas cadastradas ({vacinas.length})</h2>

                {vacinas.length === 0 ? (
                    <p className="vacina-vazia">
                        Nenhuma vacina cadastrada ainda.
                    </p>
                ) : (
                    <div className="vacina-grid">
                        {vacinas.map((vacina) => (
                            <article
                                className="vacina-card"
                                key={vacina.id}
                            >
                                <h3>{vacina.nome}</h3>

                                <p>
                                    {vacina.descricao ||
                                        "Sem descrição cadastrada."}
                                </p>

                                <div className="vacina-acoes">
                                    <button
                                        onClick={() => editar(vacina)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="vacina-excluir"
                                        onClick={() => excluir(vacina.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
