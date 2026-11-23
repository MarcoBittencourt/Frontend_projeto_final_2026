import { useEffect, useState } from "react";
import {
    listarCategorias,
    cadastrarCategoria,
    atualizarCategoria,
    excluirCategoria,
} from "../services/CategoriaService";
import "./Categorias.css";

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [editando, setEditando] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        setCategorias(listarCategorias());
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
                atualizarCategoria(editando, dados);
            } else {
                cadastrarCategoria(dados);
            }

            setCategorias(listarCategorias());
            limparFormulario();
        } catch (error) {
            setErro(error.message);
        }
    }

    function editar(categoria) {
        setEditando(categoria.id);
        setNome(categoria.nome);
        setDescricao(categoria.descricao);
        setErro("");
    }

    function excluir(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir esta categoria?"
        );

        if (!confirmar) return;

        excluirCategoria(id);
        setCategorias(listarCategorias());

        if (editando === id) {
            limparFormulario();
        }
    }

    return (
        <main className="categorias-container">
            <header className="categorias-header">
                <div>
                    <h1>Categorias de animais</h1>
                    <p>Cadastre e organize as categorias dos animais.</p>
                </div>
            </header>

            <section className="categoria-formulario">
                <h2>
                    {editando !== null ? "Editar categoria" : "Nova categoria"}
                </h2>

                <form onSubmit={salvar}>
                    <label htmlFor="nome">Nome *</label>
                    <input
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        maxLength={50}
                        required
                        placeholder="Ex.: Cachorro"
                    />

                    <label htmlFor="descricao">Descrição</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        maxLength={100}
                        placeholder="Descreva a categoria"
                    />

                    {erro && <p className="categoria-erro">{erro}</p>}

                    <div className="categoria-acoes">
                        <button type="submit">
                            {editando !== null ? "Salvar alterações" : "Cadastrar"}
                        </button>

                        {editando !== null && (
                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={limparFormulario}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="categoria-lista">
                <h2>Categorias cadastradas ({categorias.length})</h2>

                {categorias.length === 0 ? (
                    <p className="categoria-vazia">
                        Nenhuma categoria cadastrada ainda.
                    </p>
                ) : (
                    <div className="categoria-grid">
                        {categorias.map((categoria) => (
                            <article
                                className="categoria-card"
                                key={categoria.id}
                            >
                                <h3>{categoria.nome}</h3>
                                <p>
                                    {categoria.descricao ||
                                        "Sem descrição cadastrada."}
                                </p>

                                <div className="categoria-acoes">
                                    <button onClick={() => editar(categoria)}>
                                        Editar
                                    </button>

                                    <button
                                        className="botao-excluir"
                                        onClick={() => excluir(categoria.id)}
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
