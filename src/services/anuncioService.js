import { apiFetch } from "./api";

const CHAVE_ANUNCIOS = "conexao_pet_anuncios";
const MODO_OFFLINE = import.meta.env.VITE_MODO_OFFLINE === "true";

function obterLocais() {
    return JSON.parse(localStorage.getItem(CHAVE_ANUNCIOS)) || [];
}

function salvarLocais(lista) {
    localStorage.setItem(CHAVE_ANUNCIOS, JSON.stringify(lista));
}

async function lerErro(resposta, padrao) {
    const corpo = await resposta.json().catch(() => ({}));
    if (corpo.message) return corpo.message;
    if (resposta.status === 403) return "Você não é o dono deste anúncio.";
    if (resposta.status === 404) return "Anúncio não encontrado.";
    if (resposta.status === 409) return "Este animal já possui um anúncio.";
    return padrao;
}

export async function listarTodosAnuncios() {
    if (MODO_OFFLINE) return obterLocais();

    const resposta = await apiFetch("/anuncios/listaAnuncio");
    if (!resposta.ok) {
        throw new Error(await lerErro(resposta, "Erro ao carregar os anúncios."));
    }
    return resposta.json();
}

export async function listarMeusAnuncios() {
    if (MODO_OFFLINE) return obterLocais();

    const resposta = await apiFetch("/anuncios/meus");
    if (!resposta.ok) {
        throw new Error(await lerErro(resposta, "Erro ao carregar seus anúncios."));
    }
    return resposta.json();
}

export async function buscarAnuncioPorId(id) {
    if (MODO_OFFLINE) {
        const encontrado = obterLocais().find((item) => item.id === Number(id));
        if (!encontrado) throw new Error("Anúncio não encontrado.");
        return encontrado;
    }

    const resposta = await apiFetch(`/anuncios/${id}`);
    if (!resposta.ok) {
        throw new Error(await lerErro(resposta, "Anúncio não encontrado."));
    }
    return resposta.json();
}

export async function buscarAnuncioPorAnimalId(idAnimal) {
    if (MODO_OFFLINE) {
        const encontrado = obterLocais().find(
            (item) => Number(item.idAnimal ?? item.animalId) === Number(idAnimal)
        );
        if (!encontrado) {
            throw new Error("Nenhum anúncio encontrado para este animal.");
        }
        return encontrado;
    }

    const resposta = await apiFetch(`/anuncios/animal/${idAnimal}`);
    if (!resposta.ok) {
        throw new Error(
            await lerErro(resposta, "Nenhum anúncio encontrado para este animal.")
        );
    }
    return resposta.json();
}

export async function cadastrarAnuncio(dados, infoAnimalOffline = null) {
    const payload = {
        titulo: dados.titulo.trim(),
        descricao: dados.descricao.trim(),
        animal: { id: Number(dados.idAnimal) },
        bairroAnunciante: dados.bairroAnunciante.trim(),
        contatoAnunciante: dados.contatoAnunciante.trim(),
        status: dados.status || "DISPONIVEL",
    };

    if (MODO_OFFLINE) {
        const lista = obterLocais();
        const jaExiste = lista.some(
            (item) => Number(item.idAnimal) === Number(dados.idAnimal)
        );
        if (jaExiste) {
            throw new Error("Este animal já possui um anúncio.");
        }

        const novo = {
            id: Date.now(),
            titulo: payload.titulo,
            descricao: payload.descricao,
            dataPublicacao: new Date().toISOString(),
            status: payload.status,
            idAnimal: payload.animal.id,
            nomeAnimal: infoAnimalOffline?.nome || `Animal #${payload.animal.id}`,
            especie: infoAnimalOffline?.categoriaNome || "Não informada",
            porte: infoAnimalOffline?.porte || "MEDIO",
            idAnunciante: 1,
            bairroAnunciante: payload.bairroAnunciante,
            contatoAnunciante: payload.contatoAnunciante,
        };

        salvarLocais([novo, ...lista]);
        return novo;
    }

    const resposta = await apiFetch("/anuncios/cadastrar", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!resposta.ok) {
        throw new Error(await lerErro(resposta, "Não foi possível cadastrar o anúncio."));
    }
    return resposta.json();
}

export async function atualizarAnuncio(id, dados, infoAnimalOffline = null) {
    const payload = {
        titulo: dados.titulo.trim(),
        descricao: dados.descricao.trim(),
        animal: { id: Number(dados.idAnimal) },
        bairroAnunciante: dados.bairroAnunciante.trim(),
        contatoAnunciante: dados.contatoAnunciante.trim(),
        status: dados.status,
    };

    if (MODO_OFFLINE) {
        const lista = obterLocais();
        const duplicado = lista.some(
            (item) =>
                item.id !== Number(id) &&
                Number(item.idAnimal) === Number(dados.idAnimal)
        );
        if (duplicado) {
            throw new Error("Este animal já possui outro anúncio.");
        }

        let atualizado = null;
        const novaLista = lista.map((item) => {
            if (item.id !== Number(id)) return item;
            atualizado = {
                ...item,
                titulo: payload.titulo,
                descricao: payload.descricao,
                idAnimal: payload.animal.id,
                nomeAnimal: infoAnimalOffline?.nome || item.nomeAnimal,
                especie: infoAnimalOffline?.categoriaNome || item.especie,
                porte: infoAnimalOffline?.porte || item.porte,
                bairroAnunciante: payload.bairroAnunciante,
                contatoAnunciante: payload.contatoAnunciante,
                status: payload.status || item.status,
            };
            return atualizado;
        });

        salvarLocais(novaLista);
        return atualizado;
    }

    const resposta = await apiFetch(`/anuncios/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!resposta.ok) {
        throw new Error(await lerErro(resposta, "Não foi possível atualizar o anúncio."));
    }
    return resposta.json();
}
export async function removerAnuncio(id) {
    if (MODO_OFFLINE) {
        const lista = obterLocais().filter((item) => item.id !== Number(id));
        salvarLocais(lista);
        return;
    }

    const resposta = await apiFetch(`/anuncios/${id}`, {
        method: "DELETE",
    });

    if (!resposta.ok) {
        throw new Error(await lerErro(resposta, "Não foi possível remover o anúncio."));
    }
}