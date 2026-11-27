import "./Anuncios.css";

const anunciosExemplo = [
    {
        id: 1,
        titulo: "Filhote dócil procurando um lar",
        descricao:
            "Cachorrinho muito carinhoso, já vermifugado, ótimo com crianças e acostumado a ficar em apartamento.",
        dataPublicacao: "27/11/2026 14:30",
        status: "DISPONIVEL",
        nomeAnimal: "Thor",
        especie: "Cachorro",
        porte: "MEDIO",
        bairroAnunciante: "Ponta Verde",
        contatoAnunciante: "(82) 99999-1111",
    },
    {
        id: 2,
        titulo: "Gatinha calma para adoção responsável",
        descricao:
            "Gata jovem, castrada e muito tranquila. Usa a caixinha de areia corretamente e adora cochilar no sofá.",
        dataPublicacao: "26/11/2026 10:15",
        status: "DISPONIVEL",
        nomeAnimal: "Luna",
        especie: "Gato",
        porte: "PEQUENO",
        bairroAnunciante: "Jatiúca",
        contatoAnunciante: "(82) 98888-2222",
    },
    {
        id: 3,
        titulo: "Cão adulto companheiro e brincalhão",
        descricao:
            "Cachorro porte grande, vacinado e muito leal. Ideal para casa com quintal e pessoas que gostam de caminhar.",
        dataPublicacao: "20/11/2026 18:00",
        status: "INDISPONIVEL",
        nomeAnimal: "Max",
        especie: "Cachorro",
        porte: "GRANDE",
        bairroAnunciante: "Farol",
        contatoAnunciante: "(82) 97777-3333",
    },
];

export default function Anuncios() {
    return (
        <main className="anuncios-container">
            <div className="anuncios-decor decor-top"></div>
            <div className="anuncios-decor decor-bottom"></div>

            <div className="anuncios-wrapper">
                {/* CABEÇALHO SUPERIOR */}
                <header className="anuncios-hero">
                    <div className="anuncios-brand-row">
                        <div className="anuncios-logo">
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
                                <circle cx="50" cy="43" r="7" fill="currentColor" />
                                <circle cx="38" cy="34" r="5" fill="currentColor" />
                                <circle cx="62" cy="34" r="5" fill="currentColor" />
                                <circle cx="33" cy="46" r="5" fill="currentColor" />
                                <circle cx="67" cy="46" r="5" fill="currentColor" />
                            </svg>
                        </div>

                        <div>
                            <span className="hero-badge">Conexão Pet</span>
                            <h1>Anúncios de Adoção</h1>
                            <p>
                                Adote. Cuide. Faça a diferença. Gerencie os
                                anúncios dos pets disponíveis para um novo lar.
                            </p>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <div className="hero-stats">
                            <div>
                                <strong>3</strong>
                                <span>Total</span>
                            </div>
                            <div>
                                <strong>2</strong>
                                <span>Disponíveis</span>
                            </div>
                        </div>

                        <a href="/" className="btn-voltar">
                            ← Voltar ao Painel
                        </a>
                    </div>
                </header>

                {/* CARD PRINCIPAL: PAINEL VERDE + FORMULÁRIO */}
                <section className="anuncios-main-card">
                    {/* Painel verde lateral (estilo Login) */}
                    <aside className="anuncios-side-brand">
                        <div>
                            <div className="side-animals">
                                <span className="animal-dog">🐶</span>
                                <span className="animal-cat">🐱</span>
                                <span className="animal-heart">♡</span>
                            </div>

                            <h2>
                                Novo
                                <span>Anúncio</span>
                            </h2>

                            <p className="side-text">
                                Todo animal merece um lar cheio de amor. Cada
                                animal pode ter apenas um anúncio vinculado ao
                                seu ID.
                            </p>
                        </div>

                        {/* Buscas diretas (por ID do anúncio e por ID do animal) */}
                        <div className="quick-search-box">
                            <h3>Consultas Rápidas</h3>

                            <div className="quick-search-group">
                                <label htmlFor="buscaId">
                                    Buscar por ID do Anúncio
                                </label>
                                <div className="quick-search-row">
                                    <input
                                        id="buscaId"
                                        type="number"
                                        min="1"
                                        placeholder="Ex: 1"
                                    />
                                    <button type="button">Buscar</button>
                                </div>
                            </div>

                            <div className="quick-search-group">
                                <label htmlFor="buscaAnimalId">
                                    Buscar por ID do Animal
                                </label>
                                <div className="quick-search-row">
                                    <input
                                        id="buscaAnimalId"
                                        type="number"
                                        min="1"
                                        placeholder="Ex: 5"
                                    />
                                    <button type="button">Buscar</button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Formulário de Cadastro / Edição */}
                    <div className="anuncios-form-panel">
                        <div className="form-header">
                            <h2>Publicar Anúncio</h2>
                            <p>
                                Preencha os dados do anúncio para divulgar o pet
                            </p>
                        </div>

                        <form className="anuncio-form">
                            <div className="form-grid-2">
                                <div className="form-field">
                                    <label htmlFor="titulo">
                                        Título * (máx. 120)
                                    </label>
                                    <div className="anuncio-input-group">
                                        <input
                                            id="titulo"
                                            type="text"
                                            maxLength={120}
                                            placeholder="Ex: Filhote dócil para adoção responsável"
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="idAnimal">
                                        ID do Animal *
                                    </label>
                                    <div className="anuncio-input-group">
                                        <input
                                            id="idAnimal"
                                            type="number"
                                            min="1"
                                            placeholder="Informe o ID do animal"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="descricao">
                                    Descrição * (máx. 1000)
                                </label>
                                <textarea
                                    id="descricao"
                                    rows="3"
                                    maxLength={1000}
                                    className="anuncio-textarea"
                                    placeholder="Conte sobre a personalidade, vacinas, castração e cuidados do animal..."
                                />
                            </div>

                            <div className="form-grid-3">
                                <div className="form-field">
                                    <label htmlFor="contatoAnunciante">
                                        Contato do Anunciante *
                                    </label>
                                    <div className="anuncio-input-group">
                                        <input
                                            id="contatoAnunciante"
                                            type="text"
                                            placeholder="(82) 99999-9999"
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="bairroAnunciante">
                                        Bairro
                                    </label>
                                    <div className="anuncio-input-group">
                                        <input
                                            id="bairroAnunciante"
                                            type="text"
                                            placeholder="Ex: Ponta Verde"
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="status">Status</label>
                                    <div className="anuncio-input-group">
                                        <select
                                            id="status"
                                            defaultValue="DISPONIVEL"
                                        >
                                            <option value="DISPONIVEL">
                                                DISPONÍVEL
                                            </option>
                                            <option value="INDISPONIVEL">
                                                INDISPONÍVEL
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-primary">
                                    Publicar Anúncio <span>→</span>
                                </button>
                                <button type="reset" className="btn-secondary">
                                    Limpar Campos
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* BARRA DE ABAS E FILTROS */}
                <section className="anuncios-toolbar-card">
                    <div className="toolbar-top">
                        <div className="tabs-group">
                            <button type="button" className="tab-btn ativo">
                                🐾 Todos os Anúncios
                            </button>
                            <button type="button" className="tab-btn">
                                👤 Meus Anúncios
                            </button>
                        </div>

                        <button type="button" className="btn-outline">
                            ↻ Atualizar Lista
                        </button>
                    </div>

                    <div className="filtros-grid">
                        <input
                            type="text"
                            placeholder="Buscar por título ou descrição..."
                        />

                        <select defaultValue="">
                            <option value="">Todos os status</option>
                            <option value="DISPONIVEL">Disponível</option>
                            <option value="INDISPONIVEL">Indisponível</option>
                        </select>

                        <input type="text" placeholder="Espécie / Categoria" />

                        <select defaultValue="">
                            <option value="">Todos os portes</option>
                            <option value="PEQUENO">Pequeno</option>
                            <option value="MEDIO">Médio</option>
                            <option value="GRANDE">Grande</option>
                        </select>

                        <input type="text" placeholder="Bairro" />

                        <button type="button" className="btn-limpar">
                            Filtrar
                        </button>
                    </div>
                </section>

                {/* GRADE DE CARDS DE ANÚNCIOS */}
                <section className="anuncios-grid">
                    {anunciosExemplo.map((anuncio) => {
                        const disponivel = anuncio.status === "DISPONIVEL";

                        return (
                            <article className="anuncio-card" key={anuncio.id}>
                                <div className="card-top">
                                    <span
                                        className={`status-pill ${
                                            disponivel
                                                ? "disponivel"
                                                : "indisponivel"
                                        }`}
                                    >
                                        {anuncio.status}
                                    </span>
                                    <span className="card-id">
                                        #{anuncio.id}
                                    </span>
                                </div>

                                <h3>{anuncio.titulo}</h3>
                                <p className="card-descricao">
                                    {anuncio.descricao}
                                </p>

                                <div className="card-tags">
                                    <span>🐾 {anuncio.nomeAnimal}</span>
                                    <span>📂 {anuncio.especie}</span>
                                    <span>📏 {anuncio.porte}</span>
                                </div>

                                <div className="card-meta">
                                    <span>📍 {anuncio.bairroAnunciante}</span>
                                    <span>📞 {anuncio.contatoAnunciante}</span>
                                    <span>🗓️ {anuncio.dataPublicacao}</span>
                                </div>

                                <div className="card-actions">
                                    <button
                                        type="button"
                                        className="btn-acao ver"
                                    >
                                        Ver Detalhes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-acao editar"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-acao status"
                                    >
                                        {disponivel
                                            ? "Marcar Indisponível"
                                            : "Reativar"}
                                    </button>
                                    <a
                                        href="/mensagens"
                                        className="btn-acao chat"
                                    >
                                        💬 Mensagem
                                    </a>
                                    <button
                                        type="button"
                                        className="btn-acao excluir"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            </div>
        </main>
    );
}