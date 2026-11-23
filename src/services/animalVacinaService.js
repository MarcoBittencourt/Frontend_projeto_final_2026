const CHAVE_HISTORICO = "conexao_pet_animal_vacinas";

function obterHistorico() {
    return JSON.parse(localStorage.getItem(CHAVE_HISTORICO)) || [];
}

function salvarHistorico(historico) {
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
}

// Listar registros de vacinação
export function listarHistorico() {
    return obterHistorico();
}

// Cadastrar aplicação de vacina
export function cadastrarAplicacao(dados) {
    const historico = obterHistorico();

    if (dados.dataValidade < dados.dataAplicacao) {
        throw new Error(
            "A data de validade não pode ser anterior à data de aplicação."
        );
    }

    const novaAplicacao = {
        id: Date.now(),
        animalId: Number(dados.animalId),
        vacinaId: Number(dados.vacinaId),
        dataAplicacao: dados.dataAplicacao,
        dataValidade: dados.dataValidade,
    };

    salvarHistorico([...historico, novaAplicacao]);

    return novaAplicacao;
}

// Atualizar aplicação
export function atualizarAplicacao(id, dados) {
    const historico = obterHistorico();

    if (dados.dataValidade < dados.dataAplicacao) {
        throw new Error(
            "A data de validade não pode ser anterior à data de aplicação."
        );
    }

    const atualizados = historico.map((item) =>
        item.id === id
            ? {
                ...item,
                animalId: Number(dados.animalId),
                vacinaId: Number(dados.vacinaId),
                dataAplicacao: dados.dataAplicacao,
                dataValidade: dados.dataValidade,
            }
            : item
    );

    salvarHistorico(atualizados);
}

// Excluir aplicação
export function excluirAplicacao(id) {
    const historico = obterHistorico();

    salvarHistorico(
        historico.filter((item) => item.id !== id)
    );
}
