const CHAVE_CATEGORIAS = "conexao_pet_categorias";

function obterCategorias() {
    return JSON.parse(localStorage.getItem(CHAVE_CATEGORIAS)) || [];
}

function salvarCategorias(categorias) {
    localStorage.setItem(CHAVE_CATEGORIAS, JSON.stringify(categorias));
}

export function listarCategorias() {
    return obterCategorias();
}

export function cadastrarCategoria(categoria) {
    const categorias = obterCategorias();

    const nomeExiste = categorias.some(
        (item) =>
            item.nome.toLowerCase() === categoria.nome.trim().toLowerCase()
    );

    if (nomeExiste) {
        throw new Error("Já existe uma categoria com esse nome.");
    }

    const novaCategoria = {
        id: Date.now(),
        nome: categoria.nome.trim(),
        descricao: categoria.descricao.trim(),
    };

    salvarCategorias([...categorias, novaCategoria]);

    return novaCategoria;
}

export function atualizarCategoria(id, dados) {
    const categorias = obterCategorias();

    const nomeExiste = categorias.some(
        (item) =>
            item.id !== id &&
            item.nome.toLowerCase() === dados.nome.trim().toLowerCase()
    );

    if (nomeExiste) {
        throw new Error("Já existe uma categoria com esse nome.");
    }

    const atualizadas = categorias.map((item) =>
        item.id === id
            ? {
                ...item,
                nome: dados.nome.trim(),
                descricao: dados.descricao.trim(),
            }
            : item
    );

    salvarCategorias(atualizadas);
}

export function excluirCategoria(id) {
    const categorias = obterCategorias();

    salvarCategorias(categorias.filter((item) => item.id !== id));
}
