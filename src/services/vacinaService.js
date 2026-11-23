const CHAVE_VACINAS = "conexao_pet_vacinas";

function obterVacinas() {
    return JSON.parse(localStorage.getItem(CHAVE_VACINAS)) || [];
}

function salvarVacinas(vacinas) {
    localStorage.setItem(CHAVE_VACINAS, JSON.stringify(vacinas));
}

// Listar vacinas
export function listarVacinas() {
    return obterVacinas();
}

// Cadastrar vacina
export function cadastrarVacina(vacina) {
    const vacinas = obterVacinas();

    const nomeExiste = vacinas.some(
        (item) =>
            item.nome.toLowerCase() === vacina.nome.trim().toLowerCase()
    );

    if (nomeExiste) {
        throw new Error("Já existe uma vacina com esse nome.");
    }

    const novaVacina = {
        id: Date.now(),
        nome: vacina.nome.trim(),
        descricao: vacina.descricao.trim(),
    };

    salvarVacinas([...vacinas, novaVacina]);

    return novaVacina;
}

// Atualizar vacina
export function atualizarVacina(id, dados) {
    const vacinas = obterVacinas();

    const nomeExiste = vacinas.some(
        (item) =>
            item.id !== id &&
            item.nome.toLowerCase() === dados.nome.trim().toLowerCase()
    );

    if (nomeExiste) {
        throw new Error("Já existe uma vacina com esse nome.");
    }

    const atualizadas = vacinas.map((item) =>
        item.id === id
            ? {
                ...item,
                nome: dados.nome.trim(),
                descricao: dados.descricao.trim(),
            }
            : item
    );

    salvarVacinas(atualizadas);
}

// Excluir vacina
export function excluirVacina(id) {
    const vacinas = obterVacinas();

    salvarVacinas(
        vacinas.filter((vacina) => vacina.id !== id)
    );
}
