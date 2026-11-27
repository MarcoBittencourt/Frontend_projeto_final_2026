
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import RotaProtegida from "./components/RotaProtegida";

import Categorias from "./pages/Categorias";
import Animais from "./pages/Animais";
import Vacinas from "./pages/Vacinas";
import Mensagens from "./pages/Mensagens";
import Anuncios from "./pages/anuncios";

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
                            <Dashboard />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/animais"
                    element={
                        <RotaProtegida>
                            <Animais />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/anuncios"
                    element={
                        <RotaProtegida>
                            <Anuncios />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/categorias"
                    element={
                        <RotaProtegida>
                            <Categorias />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/vacinas"
                    element={
                        <RotaProtegida>
                            <Vacinas />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/mensagens"
                    element={
                        <RotaProtegida>
                            <Mensagens />
                        </RotaProtegida>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
