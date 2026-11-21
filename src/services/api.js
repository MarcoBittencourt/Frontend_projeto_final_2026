const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function getToken() {
    return localStorage.getItem("token");
}

export function salvarToken(token) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
}

export function estaLogado() {
    return !!getToken();
}

// Use no lugar do fetch nas chamadas que precisam de login
export async function apiFetch(caminho, opcoes = {}) {
    const token = getToken();
    const resposta = await fetch(`${API_URL}${caminho}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...opcoes.headers,
        },
    });

    // Token expirado ou inválido: volta pro login
    if (resposta.status === 401) {
        logout();
        window.location.href = "/login";
    }
    return resposta;
}

export async function login(email, senha) {
    const resposta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
    });

    if (resposta.status === 401 || resposta.status === 403) {
        throw new Error("E-mail ou senha inválidos.");
    }
    if (!resposta.ok) {
        throw new Error("Não foi possível entrar. Tente novamente.");
    }

    const dados = await resposta.json();
    salvarToken(dados.token);
}