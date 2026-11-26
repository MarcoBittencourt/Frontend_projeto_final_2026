import { apiFetch } from "./api";

const CHAVE_TIPO = "conexao_pet_usuario_tipo";
const CHAVE_ID = "conexao_pet_usuario_id";

export function obterIdentidade() {
    const tipo = localStorage.getItem(CHAVE_TIPO);
    const id = Number(localStorage.getItem(CHAVE_ID));

    if (!tipo || !id) return null;

    return { tipo, id };
}

export function salvarIdentidade(tipo, id) {
    localStorage.setItem(CHAVE_TIPO, tipo);
    localStorage.setItem(CHAVE_ID, String(id));
}

export function limparIdentidade() {
    localStorage.removeItem(CHAVE_TIPO);
    localStorage.removeItem(CHAVE_ID);
}

function cabecalhos(identidade) {
    return {
        "X-Usuario-Tipo": identidade.tipo,
        "X-Usuario-Id": String(identidade.id),
    };
}

async function lerErro(resposta, padrao) {
    const corpo = await resposta.json().catch(() => ({}));

    if (corpo.message) return corpo.message;
    if (resposta.status === 403) return "Você não tem acesso a esta conversa.";
    if (resposta.status === 404) return "Conversa ou anúncio não encontrado.";

    return padrao;
}

export async function listarConversas(identidade) {
    const resposta = await apiFetch("/conversas", {
        headers: cabecalhos(identidade),
    });

    if (!resposta.ok) {
        throw new Error(
            await lerErro(resposta, "Não foi possível carregar as conversas.")
        );
    }

    return resposta.json();
}

export async function iniciarConversa(identidade, anuncioId) {
    const resposta = await apiFetch("/conversas", {
        method: "POST",
        headers: cabecalhos(identidade),
        body: JSON.stringify({ anuncioId }),
    });

    if (!resposta.ok) {
        throw new Error(
            await lerErro(resposta, "Não foi possível iniciar a conversa.")
        );
    }

    return resposta.json();
}

export async function listarMensagens(identidade, conversaId, depoisDoId = 0) {
    const resposta = await apiFetch(
        `/conversas/${conversaId}/mensagens?depoisDoId=${depoisDoId}`,
        { headers: cabecalhos(identidade) }
    );

    if (!resposta.ok) {
        throw new Error(
            await lerErro(resposta, "Não foi possível carregar as mensagens.")
        );
    }

    return resposta.json();
}

export async function enviarMensagem(identidade, conversaId, conteudo) {
    const resposta = await apiFetch(`/conversas/${conversaId}/mensagens`, {
        method: "POST",
        headers: cabecalhos(identidade),
        body: JSON.stringify({ conteudo }),
    });

    if (!resposta.ok) {
        throw new Error(
            await lerErro(resposta, "Não foi possível enviar a mensagem.")
        );
    }

    return resposta.json();
}

export async function marcarComoLidas(identidade, conversaId) {
    const resposta = await apiFetch(`/conversas/${conversaId}/lidas`, {
        method: "PATCH",
        headers: cabecalhos(identidade),
    });

    if (!resposta.ok) {
        throw new Error(
            await lerErro(resposta, "Não foi possível atualizar a conversa.")
        );
    }

    return resposta.json();
}