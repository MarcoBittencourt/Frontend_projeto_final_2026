const CHAVE_ANIMAIS = "conexao_pet_animais";

function obterAnimais() {
    return JSON.parse(localStorage.getItem(CHAVE_ANIMAIS)) || [];
}

function salvarAnimais(animais) {
    localStorage.setItem(CHAVE_ANIMAIS, JSON.stringify(animais));
}

// Listar todos os animais
export function listarAnimais() {
    return obterAnimais();
}

// Cadastrar um animal
export function cadastrarAnimal(animal) {
    const animais = obterAnimais();

    const novoAnimal = {
        id: Date.now(),
        nome: animal.nome.trim(),
        idade: Number(animal.idade),
        descricao: animal.descricao.trim(),
        sexo: animal.sexo,
        peso: Number(animal.peso),
        porte: animal.porte,
        raca: animal.raca.trim(),
        categoriaId: Number(animal.categoriaId),
        foto: animal.foto || "",
    };

    salvarAnimais([...animais, novoAnimal]);

    return novoAnimal;
}

// Atualizar um animal
export function atualizarAnimal(id, dados) {
    const animais = obterAnimais();

    const atualizados = animais.map((animal) =>
        animal.id === id
            ? {
                ...animal,
                nome: dados.nome.trim(),
                idade: Number(dados.idade),
                descricao: dados.descricao.trim(),
                sexo: dados.sexo,
                peso: Number(dados.peso),
                porte: dados.porte,
                raca: dados.raca.trim(),
                categoriaId: Number(dados.categoriaId),
                foto: dados.foto || "",
            }
            : animal
    );

    salvarAnimais(atualizados);
}

// Excluir um animal
export function excluirAnimal(id) {
    const animais = obterAnimais();

    salvarAnimais(
        animais.filter((animal) => animal.id !== id)
    );
}
