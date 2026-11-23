
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RotaProtegida from "./components/RotaProtegida";
import { logout } from "./services/api";

// Home provisória, só pra testar.
function Home() {
    const navigate = useNavigate();

    function sair() {
        logout();
        navigate("/login");
    }

    return (
        <div style={{ padding: 32 }}>
            <h1>Você está logado!</h1>
            <button onClick={sair}>Sair</button>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/cadastro" element={<Cadastro />} />

                <Route
                    path="/"
                    element={
                        <RotaProtegida>
                            <Home />
                        </RotaProtegida>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
