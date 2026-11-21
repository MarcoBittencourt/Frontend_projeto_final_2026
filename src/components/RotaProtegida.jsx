import { Navigate } from "react-router-dom";
import { estaLogado } from "../services/api";

export default function RotaProtegida({ children }) {
    return estaLogado() ? children : <Navigate to="/login" replace />;
}