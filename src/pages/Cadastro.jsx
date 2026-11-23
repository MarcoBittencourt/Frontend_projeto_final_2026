
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cadastro.css";

const preferenciasDisponiveis = [
    { id: "cachorros", nome: "Cachorros", emoji: "🐶" },
    { id: "gatos", nome: "Gatos", emoji: "🐱" },
    { id: "coelhos", nome: "Coelhos", emoji: "🐰" },
    { id: "aves", nome: "Aves", emoji: "🐦" },
    { id: "sem-preferencia", nome: "Sem preferência", emoji: "❤️" },
];

export default function Cadastro() {
    const [etapa, setEtapa] = useState(1);
    const [concluido, setConcluido] = useState(false);
    const [erro, setErro] = useState("");

    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        senha: "",
        confirmarSenha: "",
        cep: "",
        estado: "",
        cidade: "",
        bairro: "",
        logradouro: "",
        numero: "",
        complemento: "",
        preferencias: [],
    });

    function atualizarCampo(e) {
        const { name, value } = e.target;

        setFormData((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    function alternarPreferencia(id) {
        setFormData((anterior) => {
            let novasPreferencias = [...anterior.preferencias];

            if (id === "sem-preferencia") {
                novasPreferencias = novasPreferencias.includes(id) ? [] : [id];
            } else {
                novasPreferencias = novasPreferencias.filter(
                    (item) => item !== "sem-preferencia"
                );

                if (novasPreferencias.includes(id)) {
                    novasPreferencias = novasPreferencias.filter(
                        (item) => item !== id
                    );
                } else {
                    novasPreferencias.push(id);
                }
            }

            return {
                ...anterior,
                preferencias: novasPreferencias,
            };
        });
    }

    function validarEtapa1() {
        if (
            !formData.nome.trim() ||
            !formData.cpf.trim() ||
            !formData.email.trim() ||
            !formData.telefone.trim() ||
            !formData.senha ||
            !formData.confirmarSenha
        ) {
            return "Preencha todos os campos obrigatórios.";
        }

        if (formData.senha.length < 6) {
            return "A senha precisa ter pelo menos 6 caracteres.";
        }

        if (formData.senha !== formData.confirmarSenha) {
            return "As senhas não são iguais.";
        }

        return "";
    }

    function validarEtapa2() {
        if (
            !formData.cep.trim() ||
            !formData.estado.trim() ||
            !formData.cidade.trim() ||
            !formData.bairro.trim() ||
            !formData.logradouro.trim() ||
            !formData.numero.trim()
        ) {
            return "Preencha todos os campos obrigatórios do endereço.";
        }

        return "";
    }

    function avancar() {
        setErro("");

        if (etapa === 1) {
            const mensagem = validarEtapa1();

            if (mensagem) {
                setErro(mensagem);
                return;
            }
        }

        if (etapa === 2) {
            const mensagem = validarEtapa2();

            if (mensagem) {
                setErro(mensagem);
                return;
            }
        }

        setEtapa((anterior) => anterior + 1);
    }

    function voltar() {
        setErro("");
        setEtapa((anterior) => anterior - 1);
    }

    function finalizar() {
        setErro("");

        if (formData.preferencias.length === 0) {
            setErro("Selecione pelo menos uma preferência.");
            return;
        }

        // Nesta etapa, os dados ainda não são enviados ao backend.
        setConcluido(true);
    }

    if (concluido) {
        return (
            <div className="cadastro-container">
                <div className="cadastro-card cadastro-sucesso">
                    <div className="sucesso-icone">✓</div>
                    <h1>Tudo pronto!</h1>
                    <p>
                        Você preencheu todas as etapas do cadastro da Conexão Pet.
                    </p>
                    <p className="sucesso-observacao">
                        A próxima etapa será conectar o formulário ao sistema para salvar
                        seus dados.
                    </p>
                    <Link to="/login" className="cadastro-botao">
                        Ir para o login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cadastro-container">
            <div className="cadastro-card">


                <aside className="cadastro-lateral">

                    <div className="cadastro-logo">
                        <span className="logo-pata">🐾</span>
                        <span>Conexão Pet</span>
                    </div>

                    <div className="lateral-conteudo">
        <span className="lateral-etiqueta">
            FAÇA PARTE DESSA CONEXÃO
        </span>

                        <h1>
                            Um novo começo
                            para quem precisa
                            de amor.
                        </h1>

                        <p>
                            Cadastre-se e ajude a conectar animais
                            que precisam de um lar com pessoas
                            dispostas a oferecer carinho.
                        </p>
                    </div>

                    <div className="lateral-ilustracao">
                        🐟 🐦
                    </div>

                    <div className="lateral-rodape">
                        Todo animal merece um lar cheio de amor.
                    </div>

                </aside>


                <main className="cadastro-conteudo">
                    <div className="cadastro-topo">
                        <span>Já possui uma conta?</span>
                        <Link to="/login">Entrar</Link>
                    </div>

                    <div className="cadastro-formulario">
                        <div className="etapa-indicador">
                            {[1, 2, 3].map((numero) => (
                                <div
                                    key={numero}
                                    className={`etapa-item ${
                                        etapa >= numero ? "etapa-ativa" : ""
                                    }`}
                                >
                                    <div className="etapa-circulo">
                                        {etapa > numero ? "✓" : numero}
                                    </div>
                                    <span>
                    {numero === 1
                        ? "Pessoal"
                        : numero === 2
                            ? "Endereço"
                            : "Preferências"}
                  </span>
                                </div>
                            ))}
                        </div>

                        <div className="progresso-fundo">
                            <div
                                className="progresso-preenchido"
                                style={{ width: `${(etapa / 3) * 100}%` }}
                            />
                        </div>

                        <div className="formulario-titulo">
              <span className="formulario-etiqueta">
                ETAPA {etapa} DE 3
              </span>

                            <h2>
                                {etapa === 1
                                    ? "Vamos nos conhecer!"
                                    : etapa === 2
                                        ? "Onde você mora?"
                                        : "Quais animais você ama?"}
                            </h2>

                            <p>
                                {etapa === 1
                                    ? "Informe seus dados para criar sua conta."
                                    : etapa === 2
                                        ? "Precisamos do seu endereço para completar seu cadastro."
                                        : "Escolha os animais que você tem interesse em conhecer."}
                            </p>
                        </div>

                        {erro && <div className="cadastro-erro">{erro}</div>}

                        {etapa === 1 && (
                            <div className="campos-grid">
                                <div className="campo campo-completo">
                                    <label>Nome completo *</label>
                                    <input
                                        name="nome"
                                        value={formData.nome}
                                        onChange={atualizarCampo}
                                        placeholder="Digite seu nome completo"
                                    />
                                </div>

                                <div className="campo">
                                    <label>CPF *</label>
                                    <input
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={atualizarCampo}
                                        placeholder="000.000.000-00"
                                    />
                                </div>

                                <div className="campo">
                                    <label>Telefone *</label>
                                    <input
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={atualizarCampo}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>

                                <div className="campo campo-completo">
                                    <label>E-mail *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={atualizarCampo}
                                        placeholder="seuemail@exemplo.com"
                                    />
                                </div>

                                <div className="campo">
                                    <label>Senha *</label>
                                    <input
                                        type="password"
                                        name="senha"
                                        value={formData.senha}
                                        onChange={atualizarCampo}
                                        placeholder="Mínimo de 6 caracteres"
                                    />
                                </div>

                                <div className="campo">
                                    <label>Confirmar senha *</label>
                                    <input
                                        type="password"
                                        name="confirmarSenha"
                                        value={formData.confirmarSenha}
                                        onChange={atualizarCampo}
                                        placeholder="Repita sua senha"
                                    />
                                </div>
                            </div>
                        )}

                        {etapa === 2 && (
                            <div className="campos-grid">
                                <div className="campo">
                                    <label>CEP *</label>
                                    <input
                                        name="cep"
                                        value={formData.cep}
                                        onChange={atualizarCampo}
                                        placeholder="00000-000"
                                    />
                                </div>

                                <div className="campo">
                                    <label>Estado *</label>
                                    <input
                                        name="estado"
                                        value={formData.estado}
                                        onChange={atualizarCampo}
                                        placeholder="Ex.: AL"
                                        maxLength={2}
                                    />
                                </div>

                                <div className="campo campo-completo">
                                    <label>Cidade *</label>
                                    <input
                                        name="cidade"
                                        value={formData.cidade}
                                        onChange={atualizarCampo}
                                        placeholder="Sua cidade"
                                    />
                                </div>

                                <div className="campo">
                                    <label>Bairro *</label>
                                    <input
                                        name="bairro"
                                        value={formData.bairro}
                                        onChange={atualizarCampo}
                                        placeholder="Seu bairro"
                                    />
                                </div>

                                <div className="campo">
                                    <label>Número *</label>
                                    <input
                                        name="numero"
                                        value={formData.numero}
                                        onChange={atualizarCampo}
                                        placeholder="Nº da residência"
                                    />
                                </div>

                                <div className="campo campo-completo">
                                    <label>Rua / Logradouro *</label>
                                    <input
                                        name="logradouro"
                                        value={formData.logradouro}
                                        onChange={atualizarCampo}
                                        placeholder="Nome da rua ou avenida"
                                    />
                                </div>

                                <div className="campo campo-completo">
                                    <label>Complemento</label>
                                    <input
                                        name="complemento"
                                        value={formData.complemento}
                                        onChange={atualizarCampo}
                                        placeholder="Apartamento, bloco, referência (opcional)"
                                    />
                                </div>
                            </div>
                        )}

                        {etapa === 3 && (
                            <div className="preferencias-area">
                                <div className="preferencias-grid">
                                    {preferenciasDisponiveis.map((animal) => {
                                        const selecionado = formData.preferencias.includes(
                                            animal.id
                                        );

                                        return (
                                            <button
                                                type="button"
                                                key={animal.id}
                                                className={`preferencia-card ${
                                                    selecionado ? "preferencia-selecionada" : ""
                                                }`}
                                                onClick={() => alternarPreferencia(animal.id)}
                                            >
                        <span className="preferencia-emoji">
                          {animal.emoji}
                        </span>
                                                <span>{animal.nome}</span>
                                                <span className="preferencia-check">
                          {selecionado ? "✓" : ""}
                        </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <p className="preferencias-ajuda">
                                    Você pode selecionar mais de uma opção. Se escolher
                                    "Sem preferência", nenhuma outra categoria poderá ser
                                    selecionada.
                                </p>
                            </div>
                        )}

                        <div className="cadastro-acoes">
                            {etapa > 1 && (
                                <button
                                    type="button"
                                    className="botao-voltar"
                                    onClick={voltar}
                                >
                                    Voltar
                                </button>
                            )}

                            {etapa < 3 ? (
                                <button
                                    type="button"
                                    className="cadastro-botao"
                                    onClick={avancar}
                                >
                                    Continuar
                                    <span>→</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="cadastro-botao"
                                    onClick={finalizar}
                                >
                                    Finalizar cadastro
                                    <span>✓</span>
                                </button>
                            )}
                        </div>

                        <p className="cadastro-termos">
                            Ao continuar, você concorda em fazer parte da comunidade
                            Conexão Pet.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
