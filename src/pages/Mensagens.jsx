import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    obterIdentidade,
    salvarIdentidade,
    limparIdentidade,
    listarConversas,
    iniciarConversa,
    listarMensagens,
    enviarMensagem,
    marcarComoLidas,
} from "../services/mensagemService";
import "./Mensagens.css";

const ROTULOS = {
    INTERESSADO: "Interessado",
    ANUNCIANTE: "Anunciante",
};

function mesmoDia(data) {
    return data.toDateString() === new Date().toDateString();
}

function formatarResumo(iso) {
    if (!iso) return "";

    const data = new Date(iso);

    if (mesmoDia(data)) {
        return data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
    });
}

function formatarCompleto(iso) {
    if (!iso) return "";

    const data = new Date(iso);
    const hora = data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (mesmoDia(data)) return hora;

    const dia = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
    });

    return `${dia} ${hora}`;
}

function nomeDoOutro(conversa, tipo) {
    const nome =
        tipo === "ANUNCIANTE"
            ? conversa.interessadoNome
            : conversa.anuncianteNome;

    return nome || "Usuário";
}

function descricaoDoAnimal(conversa) {
    return conversa.animalNome
        ? `Sobre ${conversa.animalNome}`
        : `Sobre o anúncio ${conversa.anuncioId}`;
}

function Identificacao({ aoConfirmar }) {
    const [tipo, setTipo] = useState("INTERESSADO");
    const [id, setId] = useState("");
    const [erro, setErro] = useState("");

    function confirmar(e) {
        e.preventDefault();

        const numero = Number(id);

        if (!Number.isInteger(numero) || numero <= 0) {
            setErro("Informe um número de usuário válido.");
            return;
        }

        salvarIdentidade(tipo, numero);
        aoConfirmar({ tipo, id: numero });
    }

    return (
        <main className="msg-identificacao">
            <form className="msg-identificacao-card" onSubmit={confirmar}>
                <h1>Mensagens</h1>
                <p>Informe seu perfil e o seu número de usuário para ver as conversas.</p>

                <label htmlFor="msg-tipo">Perfil</label>
                <select
                    id="msg-tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="INTERESSADO">Interessado em adotar</option>
                    <option value="ANUNCIANTE">Anunciante</option>
                </select>

                <label htmlFor="msg-id">Número de usuário</label>
                <input
                    id="msg-id"
                    type="number"
                    min="1"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Ex.: 1"
                    required
                />

                {erro && <p className="msg-erro">{erro}</p>}

                <button type="submit" className="msg-botao">
                    Ver conversas
                </button>
            </form>
        </main>
    );
}

export default function Mensagens() {
    const navigate = useNavigate();

    const [identidade, setIdentidade] = useState(obterIdentidade);
    const [conversas, setConversas] = useState([]);
    const [selecionadaId, setSelecionadaId] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [texto, setTexto] = useState("");
    const [busca, setBusca] = useState("");
    const [anuncioId, setAnuncioId] = useState("");
    const [erroLista, setErroLista] = useState("");
    const [erroConversa, setErroConversa] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    const ultimoIdRef = useRef(0);
    const areaRef = useRef(null);

    const carregarConversas = useCallback(async () => {
        if (!identidade) return;

        try {
            const lista = await listarConversas(identidade);
            setConversas(lista);
            setErroLista("");
        } catch (erro) {
            setErroLista(erro.message);
        } finally {
            setCarregando(false);
        }
    }, [identidade]);

    useEffect(() => {
        if (!identidade) return;

        const primeira = setTimeout(carregarConversas, 0);
        const intervalo = setInterval(carregarConversas, 8000);

        return () => {
            clearTimeout(primeira);
            clearInterval(intervalo);
        };
    }, [identidade, carregarConversas]);

    useEffect(() => {
        if (!identidade || selecionadaId === null) return;

        let ativo = true;
        ultimoIdRef.current = 0;

        async function carregarHistorico() {
            try {
                const lista = await listarMensagens(identidade, selecionadaId, 0);

                if (!ativo) return;

                setMensagens(lista);
                setErroConversa("");
                ultimoIdRef.current = lista.length
                    ? lista[lista.length - 1].id
                    : 0;

                await marcarComoLidas(identidade, selecionadaId);
                carregarConversas();
            } catch (erro) {
                if (ativo) setErroConversa(erro.message);
            }
        }

        async function buscarNovas() {
            try {
                const novas = await listarMensagens(
                    identidade,
                    selecionadaId,
                    ultimoIdRef.current
                );

                if (!ativo || novas.length === 0) return;

                ultimoIdRef.current = novas[novas.length - 1].id;

                setMensagens((anterior) => [
                    ...anterior,
                    ...novas.filter(
                        (nova) => !anterior.some((item) => item.id === nova.id)
                    ),
                ]);

                if (novas.some((item) => item.remetente !== identidade.tipo)) {
                    await marcarComoLidas(identidade, selecionadaId);
                    carregarConversas();
                }
            } catch {
                return;
            }
        }

        carregarHistorico();

        const intervalo = setInterval(buscarNovas, 4000);

        return () => {
            ativo = false;
            clearInterval(intervalo);
        };
    }, [identidade, selecionadaId, carregarConversas]);

    useEffect(() => {
        const area = areaRef.current;

        if (area) area.scrollTop = area.scrollHeight;
    }, [mensagens]);

    function abrirConversa(id) {
        setMensagens([]);
        setTexto("");
        setErroConversa("");
        setSelecionadaId(id);
    }

    function voltarParaLista() {
        setSelecionadaId(null);
        setMensagens([]);
    }

    function trocarPerfil() {
        limparIdentidade();
        setIdentidade(null);
        setConversas([]);
        setMensagens([]);
        setSelecionadaId(null);
        setCarregando(true);
    }

    async function abrirNovaConversa(e) {
        e.preventDefault();
        setErroLista("");

        const numero = Number(anuncioId);

        if (!Number.isInteger(numero) || numero <= 0) {
            setErroLista("Informe o número do anúncio.");
            return;
        }

        try {
            const conversa = await iniciarConversa(identidade, numero);

            setAnuncioId("");
            await carregarConversas();
            abrirConversa(conversa.id);
        } catch (erro) {
            setErroLista(erro.message);
        }
    }

    async function enviar(e) {
        e.preventDefault();

        const conteudo = texto.trim();

        if (!conteudo || enviando) return;

        setEnviando(true);
        setErroConversa("");

        try {
            const nova = await enviarMensagem(
                identidade,
                selecionadaId,
                conteudo
            );

            ultimoIdRef.current = Math.max(ultimoIdRef.current, nova.id);

            setMensagens((anterior) =>
                anterior.some((item) => item.id === nova.id)
                    ? anterior
                    : [...anterior, nova]
            );

            setTexto("");
            carregarConversas();
        } catch (erro) {
            setErroConversa(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    function aoPressionarTecla(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            enviar(e);
        }
    }

    if (!identidade) {
        return (
            <Identificacao
                aoConfirmar={(novaIdentidade) => {
                    setCarregando(true);
                    setIdentidade(novaIdentidade);
                }}
            />
        );
    }

    const termo = busca.trim().toLowerCase();

    const conversasVisiveis = [...conversas]
        .sort((a, b) =>
            String(b.ultimaMensagemEm || "").localeCompare(
                String(a.ultimaMensagemEm || "")
            )
        )
        .filter((conversa) => {
            if (!termo) return true;

            return (
                nomeDoOutro(conversa, identidade.tipo)
                    .toLowerCase()
                    .includes(termo) ||
                (conversa.animalNome || "").toLowerCase().includes(termo)
            );
        });

    const selecionada = conversas.find((item) => item.id === selecionadaId);
    const nomeSelecionada = selecionada
        ? nomeDoOutro(selecionada, identidade.tipo)
        : "";

    return (
        <div className="msg-pagina">
            <header className="msg-topo">
                <div>
                    <h1>Mensagens</h1>
                    <p>
                        {identidade.tipo === "ANUNCIANTE"
                            ? "Converse com quem se interessou pelos seus anúncios."
                            : "Converse com os anunciantes dos animais que você quer adotar."}
                    </p>
                </div>

                <div className="msg-topo-acoes">
                    <span className="msg-perfil">
                        {ROTULOS[identidade.tipo]} nº {identidade.id}
                    </span>

                    <button
                        type="button"
                        className="msg-botao msg-botao-claro"
                        onClick={trocarPerfil}
                    >
                        Trocar perfil
                    </button>

                    <button
                        type="button"
                        className="msg-botao"
                        onClick={() => navigate("/")}
                    >
                        Voltar ao início
                    </button>
                </div>
            </header>

            <section
                className={`msg-painel ${selecionada ? "msg-com-conversa" : ""}`}
            >
                <aside className="msg-lista">
                    <div className="msg-lista-topo">
                        <input
                            type="search"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar por nome ou animal"
                            aria-label="Buscar conversa"
                        />

                        {identidade.tipo === "INTERESSADO" && (
                            <form
                                className="msg-nova"
                                onSubmit={abrirNovaConversa}
                            >
                                <input
                                    type="number"
                                    min="1"
                                    value={anuncioId}
                                    onChange={(e) => setAnuncioId(e.target.value)}
                                    placeholder="Número do anúncio"
                                    aria-label="Número do anúncio"
                                />
                                <button type="submit" className="msg-botao">
                                    Iniciar conversa
                                </button>
                            </form>
                        )}

                        {erroLista && <p className="msg-erro">{erroLista}</p>}
                    </div>

                    <div className="msg-lista-itens">
                        {carregando && (
                            <p className="msg-vazio">Carregando conversas...</p>
                        )}

                        {!carregando && conversasVisiveis.length === 0 && (
                            <p className="msg-vazio">
                                {conversas.length === 0
                                    ? identidade.tipo === "INTERESSADO"
                                        ? "Nenhuma conversa ainda. Informe o número de um anúncio para falar com o anunciante."
                                        : "Nenhuma conversa ainda. Quando um interessado entrar em contato, ela aparece aqui."
                                    : "Nenhuma conversa encontrada para essa busca."}
                            </p>
                        )}

                        {conversasVisiveis.map((conversa) => {
                            const nome = nomeDoOutro(conversa, identidade.tipo);

                            return (
                                <button
                                    type="button"
                                    key={conversa.id}
                                    className={`msg-item ${
                                        conversa.id === selecionadaId
                                            ? "msg-item-ativo"
                                            : ""
                                    }`}
                                    onClick={() => abrirConversa(conversa.id)}
                                >
                                    <span className="msg-avatar">
                                        {nome.charAt(0).toUpperCase()}
                                    </span>

                                    <span className="msg-item-corpo">
                                        <span className="msg-item-linha">
                                            <strong>{nome}</strong>
                                            <time>
                                                {formatarResumo(
                                                    conversa.ultimaMensagemEm
                                                )}
                                            </time>
                                        </span>

                                        <span className="msg-item-animal">
                                            {descricaoDoAnimal(conversa)}
                                        </span>

                                        <span className="msg-item-linha">
                                            <span className="msg-item-previa">
                                                {conversa.ultimaMensagem ||
                                                    "Nenhuma mensagem ainda."}
                                            </span>

                                            {conversa.naoLidas > 0 && (
                                                <span className="msg-badge">
                                                    {conversa.naoLidas}
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <div className="msg-conversa">
                    {!selecionada ? (
                        <div className="msg-selecione">
                            <h2>Selecione uma conversa</h2>
                            <p>Escolha uma conversa na lista para ler e responder.</p>
                        </div>
                    ) : (
                        <>
                            <header className="msg-conversa-topo">
                                <button
                                    type="button"
                                    className="msg-voltar"
                                    onClick={voltarParaLista}
                                >
                                    Voltar
                                </button>

                                <span className="msg-avatar">
                                    {nomeSelecionada.charAt(0).toUpperCase()}
                                </span>

                                <div>
                                    <h2>{nomeSelecionada}</h2>
                                    <p>{descricaoDoAnimal(selecionada)}</p>
                                </div>
                            </header>

                            <div className="msg-area" ref={areaRef}>
                                {mensagens.length === 0 && !erroConversa && (
                                    <p className="msg-vazio msg-vazio-centro">
                                        Envie a primeira mensagem.
                                    </p>
                                )}

                                {mensagens.map((mensagem) => {
                                    const minha =
                                        mensagem.remetente === identidade.tipo;

                                    return (
                                        <div
                                            key={mensagem.id}
                                            className={`msg-bolha ${
                                                minha
                                                    ? "msg-bolha-minha"
                                                    : "msg-bolha-outro"
                                            }`}
                                        >
                                            <p>{mensagem.conteudo}</p>

                                            <span className="msg-bolha-info">
                                                {formatarCompleto(
                                                    mensagem.criadaEm
                                                )}
                                                {minha && mensagem.lidaEm
                                                    ? " Lida"
                                                    : ""}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {erroConversa && (
                                <p className="msg-erro msg-erro-conversa">
                                    {erroConversa}
                                </p>
                            )}

                            <form className="msg-envio" onSubmit={enviar}>
                                <textarea
                                    value={texto}
                                    onChange={(e) => setTexto(e.target.value)}
                                    onKeyDown={aoPressionarTecla}
                                    maxLength={2000}
                                    rows={2}
                                    placeholder="Escreva sua mensagem"
                                    aria-label="Mensagem"
                                />

                                <button
                                    type="submit"
                                    className="msg-botao"
                                    disabled={enviando || !texto.trim()}
                                >
                                    {enviando ? "Enviando..." : "Enviar"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
