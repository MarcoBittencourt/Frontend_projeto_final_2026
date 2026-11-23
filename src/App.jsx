
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RotaProtegida from "./components/RotaProtegida";
import Categorias from "./pages/Categorias";
import Animais from "./pages/Animais";
import Vacinas from "./pages/Vacinas";

function ModuloEmConstrucao({ titulo }) {
  return (
    <div style={{ padding: 32 }}>
      <h1>{titulo}</h1>
      <p>Esta funcionalidade está em desenvolvimento.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

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

      </Routes>
    </BrowserRouter>
  );
}
