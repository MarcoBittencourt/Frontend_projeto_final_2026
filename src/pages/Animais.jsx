import { useEffect, useState } from "react";
import {
    listarAnimais,
    cadastrarAnimal,
    atualizarAnimal,
    excluirAnimal,
} from "../services/animalService";
import { listarCategorias } from "../services/CategoriaService";
import {
    listarHistorico,
    cadastrarAplicacao,
    atualizarAplicacao,
    excluirAplicacao,
} from "../services/animalVacinaService";
import { listarVacinas } from "../services/vacinaService";
import "./Animais.css";

const formularioInicial = {
    nome: "",
    idade: "",
    descricao: "",
    sexo: "",
    peso: "",
    porte: "",
    raca: "",
    categoriaId: "",
};

const formularioVacinaInicial = {
    vacinaId: "",
    dataAplicacao: "",
    dataValidade: "",
};

export default function Animais() {
    const [animais, setAnimais] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [foto, setFoto] = useState("");
    const [editando, setEditando] = useState(null);
    const [erro, setErro] = useState("");

    // Estados do histórico de vacinação
    const [animalSelecionado, setAnimalSelecionado] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [vacinas, setVacinas] = useState([]);
    const [formularioVacina, setFormularioVacina] = useState(formularioVacinaInicial);
    const [editandoAplicacao, setEditandoAplicacao] = useState(null);
    const [erroVacina, setErroVacina] = useState("");

    function carregarDados() {
        setAnimais(listarAnimais());
        setCategorias(listarCategorias());
        setHistorico(listarHistorico());
        setVacinas(listarVacinas());
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function alterarCampo(e) {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    function selecionarFoto(e) {
        const arquivo = e.target.files[0];

        if (!arquivo) return;

        if (!["image/jpeg", "image/png"].includes(arquivo.type)) {
            setErro("Selecione uma imagem JPG ou PNG.");
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            setErro("A imagem deve ter no máximo 2 MB.");
            return;
        }

        const leitor = new FileReader();

        leitor.onload = () => {
            setFoto(leitor.result);
            setErro("");
        };

        leitor.readAsDataURL(arquivo);
    }

    function limparFormulario() {
        setFormulario(formularioInicial);
        setFoto("");
        setEditando(null);
        setErro("");
    }

    function salvar(e) {
        e.preventDefault();
        setErro("");

        if (categorias.length === 0) {
            setErro("Cadastre uma categoria antes de cadastrar animais.");
            return;
        }

        try {
            const dados = {
                ...formulario,
                foto,
            };

            if (editando !== null) {
                atualizarAnimal(editando, dados);
            } else {
                cadastrarAnimal(dados);
            }

            carregarDados();
            limparFormulario();
        } catch (error) {
            setErro(error.message || "Não foi possível salvar o animal.");
        }
    }

    function editar(animal) {
        setEditando(animal.id);

        setFormulario({
            nome: animal.nome,
            idade: animal.idade,
            descricao: animal.descricao,
            sexo: animal.sexo,
            peso: animal.peso,
            porte: animal.porte,
            raca: animal.raca || "",
            categoriaId: String(animal.categoriaId),
        });

        setFoto(animal.foto || "");
        setErro("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function excluir(id) {
        if (!window.confirm("Deseja realmente excluir este animal?")) {
            return;
        }

        excluirAnimal(id);

        if (animalSelecionado?.id === id) {
            setAnimalSelecionado(null);
        }

        carregarDados();

        if (editando === id) {
            limparFormulario();
        }
    }

    function nomeCategoria(id) {
        const categoria = categorias.find(
            (item) => Number(item.id) === Number(id)
        );

        return categoria ? categoria.nome : "Categoria não encontrada";
    }

    // Abre os detalhes e carrega o histórico atualizado
    function abrirDetalhes(animal) {
        setAnimalSelecionado(animal);
        setHistorico(listarHistorico());
        setVacinas(listarVacinas());
        limparFormularioVacina();
    }

    function limparFormularioVacina() {
        setFormularioVacina(formularioVacinaInicial);
        setEditandoAplicacao(null);
        setErroVacina("");
    }

    function alterarCampoVacina(e) {
        const { name, value } = e.target;

        setFormularioVacina((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    function salvarAplicacao(e) {
        e.preventDefault();
        setErroVacina("");

        try {
            const dados = {
                ...formularioVacina,
                animalId: animalSelecionado.id,
            };

            if (editandoAplicacao !== null) {
                atualizarAplicacao(editandoAplicacao, dados);
            } else {
                cadastrarAplicacao(dados);
            }

            setHistorico(listarHistorico());
            limparFormularioVacina();
        } catch (error) {
            setErroVacina(
                error.message || "Não foi possível registrar a vacinação."
            );
        }
    }

    function editarAplicacao(aplicacao) {
        setFormularioVacina({
            vacinaId: String(aplicacao.vacinaId),
            dataAplicacao: aplicacao.dataAplicacao,
            dataValidade: aplicacao.dataValidade,
        });

        setEditandoAplicacao(aplicacao.id);
        setErroVacina("");
    }

    function excluirAplicacao(id) {
        if (!window.confirm("Deseja excluir esta aplicação de vacina?")) {
            return;
        }

        excluirAplicacaoServico(id);
    }

    // Mantém o nome do serviço separado da função da tela
    function excluirAplicacaoServico(id) {
        excluirAplicacao(id);
        setHistorico(listarHistorico());

        if (editandoAplicacao === id) {
            limparFormularioVacina();
        }
    }

    function nomeVacina(id) {
        const vacina = vacinas.find(
            (item) => Number(item.id) === Number(id)
        );

        return vacina ? vacina.nome : "Vacina não encontrada";
    }

    function formatarData(data) {
        if (!data) return "-";

        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    const vacinasDoAnimal = animalSelecionado
        ? historico.filter(
            (item) =>
                Number(item.animalId) === Number(animalSelecionado.id)
        )
        : [];

    return (
        <main className="animais-container">
            <header className="animais-header">
                <h1>Gerenciamento de animais</h1>
                <p>Cadastre e organize os animais disponíveis na plataforma.</p>
            </header>

            <section className="animal-formulario">
                <h2>
                    {editando !== null ? "Editar animal" : "Cadastrar animal"}
                </h2>

                <form onSubmit={salvar}>
                    <label htmlFor="nome">Nome *</label>
                    <input
                        id="nome"
                        name="nome"
                        value={formulario.nome}
                        onChange={alterarCampo}
                        maxLength={40}
                        required
                    />

                    <div className="animal-campos-duplos">
                        <div>
                            <label htmlFor="idade">Idade *</label>
                            <input
                                id="idade"
                                name="idade"
                                type="number"
                                min="0"
                                value={formulario.idade}
                                onChange={alterarCampo}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="peso">Peso (kg) *</label>
                            <input
                                id="peso"
                                name="peso"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formulario.peso}
                                onChange={alterarCampo}
                                required
                            />
                        </div>
                    </div>

                    <label htmlFor="descricao">Descrição *</label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={formulario.descricao}
                        onChange={alterarCampo}
                        maxLength={200}
                        required
                    />

                    <div className="animal-campos-duplos">
                        <div>
                            <label htmlFor="sexo">Sexo *</label>
                            <select
                                id="sexo"
                                name="sexo"
                                value={formulario.sexo}
                                onChange={alterarCampo}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="MACHO">Macho</option>
                                <option value="FEMEA">Fêmea</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="porte">Porte *</label>
                            <select
                                id="porte"
                                name="porte"
                                value={formulario.porte}
                                onChange={alterarCampo}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="PEQUENO">Pequeno</option>
                                <option value="MEDIO">Médio</option>
                                <option value="GRANDE">Grande</option>
                            </select>
                        </div>
                    </div>

                    <label htmlFor="raca">Raça</label>
                    <input
                        id="raca"
                        name="raca"
                        value={formulario.raca}
                        onChange={alterarCampo}
                        maxLength={40}
                    />

                    <label htmlFor="categoriaId">Categoria *</label>
                    <select
                        id="categoriaId"
                        name="categoriaId"
                        value={formulario.categoriaId}
                        onChange={alterarCampo}
                        required
                    >
                        <option value="">Selecione uma categoria</option>

                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="foto">Foto do animal</label>
                    <input
                        id="foto"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={selecionarFoto}
                    />

                    {foto && (
                        <div className="animal-preview">
                            <img src={foto} alt="Prévia do animal" />
                            <button
                                type="button"
                                className="animal-remover-foto"
                                onClick={() => setFoto("")}
                            >
                                Remover foto
                            </button>
                        </div>
                    )}

                    {erro && <p className="animal-erro">{erro}</p>}

                    <div className="animal-acoes">
                        <button type="submit">
                            {editando !== null ? "Salvar alterações" : "Cadastrar animal"}
                        </button>

                        {editando !== null && (
                            <button
                                type="button"
                                className="animal-cancelar"
                                onClick={limparFormulario}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="animal-lista">
                <h2>Animais cadastrados ({animais.length})</h2>

                {animais.length === 0 ? (
                    <p>Nenhum animal cadastrado ainda.</p>
                ) : (
                    <div className="animal-grid">
                        {animais.map((animal) => (
                            <article className="animal-card" key={animal.id}>
                                {animal.foto ? (
                                    <img src={animal.foto} alt={animal.nome} />
                                ) : (
                                    <div className="animal-sem-foto">
                                        Sem foto
                                    </div>
                                )}

                                <h3>{animal.nome}</h3>
                                <p>Categoria: {nomeCategoria(animal.categoriaId)}</p>
                                <p>Idade: {animal.idade} anos</p>
                                <p>Porte: {animal.porte}</p>
                                <p>Sexo: {animal.sexo}</p>

                                <div className="animal-acoes">
                                    <button
                                        type="button"
                                        onClick={() => abrirDetalhes(animal)}
                                    >
                                        Ver detalhes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => editar(animal)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="animal-excluir"
                                        onClick={() => excluir(animal.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {animalSelecionado && (
                <section className="animal-detalhes">
                    <div className="animal-detalhes-cabecalho">
                        <div>
                            <h2>Detalhes de {animalSelecionado.nome}</h2>
                            <p>Informações e histórico de vacinação deste animal.</p>
                        </div>

                        <button
                            type="button"
                            className="animal-fechar-detalhes"
                            onClick={() => {
                                setAnimalSelecionado(null);
                                limparFormularioVacina();
                            }}
                        >
                            Fechar
                        </button>
                    </div>

                    <div className="animal-dados">
                        <p><strong>Descrição:</strong> {animalSelecionado.descricao}</p>
                        <p><strong>Raça:</strong> {animalSelecionado.raca || "Não informada"}</p>
                        <p><strong>Categoria:</strong> {nomeCategoria(animalSelecionado.categoriaId)}</p>
                        <p><strong>Idade:</strong> {animalSelecionado.idade} anos</p>
                        <p><strong>Sexo:</strong> {animalSelecionado.sexo}</p>
                        <p><strong>Peso:</strong> {animalSelecionado.peso} kg</p>
                        <p><strong>Porte:</strong> {animalSelecionado.porte}</p>
                    </div>

                    <div className="animal-vacinacao">
                        <h3>Histórico de vacinação</h3>

                        {vacinas.length === 0 ? (
                            <p>Cadastre uma vacina antes de registrar uma aplicação.</p>
                        ) : (
                            <form onSubmit={salvarAplicacao}>
                                <div className="animal-campos-duplos">
                                    <div>
                                        <label htmlFor="vacinaId">Vacina *</label>
                                        <select
                                            id="vacinaId"
                                            name="vacinaId"
                                            value={formularioVacina.vacinaId}
                                            onChange={alterarCampoVacina}
                                            required
                                        >
                                            <option value="">Selecione uma vacina</option>
                                            {vacinas.map((vacina) => (
                                                <option key={vacina.id} value={vacina.id}>
                                                    {vacina.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="dataAplicacao">Data de aplicação *</label>
                                        <input
                                            id="dataAplicacao"
                                            name="dataAplicacao"
                                            type="date"
                                            value={formularioVacina.dataAplicacao}
                                            onChange={alterarCampoVacina}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="dataValidade">Data de validade *</label>
                                        <input
                                            id="dataValidade"
                                            name="dataValidade"
                                            type="date"
                                            min={formularioVacina.dataAplicacao || undefined}
                                            value={formularioVacina.dataValidade}
                                            onChange={alterarCampoVacina}
                                            required
                                        />
                                    </div>
                                </div>

                                {erroVacina && (
                                    <p className="animal-erro">{erroVacina}</p>
                                )}

                                <div className="animal-acoes">
                                    <button type="submit">
                                        {editandoAplicacao !== null
                                            ? "Salvar alterações"
                                            : "Registrar vacinação"}
                                    </button>

                                    {editandoAplicacao !== null && (
                                        <button
                                            type="button"
                                            className="animal-cancelar"
                                            onClick={limparFormularioVacina}
                                        >
                                            Cancelar edição
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}

                        <div className="animal-historico-lista">
                            {vacinasDoAnimal.length === 0 ? (
                                <p>Este animal ainda não possui vacinações registradas.</p>
                            ) : (
                                vacinasDoAnimal.map((aplicacao) => (
                                    <article
                                        className="animal-vacina-card"
                                        key={aplicacao.id}
                                    >
                                        <div>
                                            <h4>{nomeVacina(aplicacao.vacinaId)}</h4>
                                            <p>
                                                Aplicação: {formatarData(aplicacao.dataAplicacao)}
                                            </p>
                                            <p>
                                                Validade: {formatarData(aplicacao.dataValidade)}
                                            </p>
                                        </div>

                                        <div className="animal-acoes">
                                            <button
                                                type="button"
                                                onClick={() => editarAplicacao(aplicacao)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="animal-excluir"
                                                onClick={() => excluirAplicacao(aplicacao.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}