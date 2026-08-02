import { Navigate, Route, Routes } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovaGarantia from "./pages/NovaGarantia";
import EditarGarantia from "./pages/EditarGarantia";
import Financeiro from "./pages/Financeiro";
import Clientes from "./pages/Clientes";
import Estoque from "./pages/Estoque";
import Configuracoes from "./pages/Configuracoes";
import Consulta from "./pages/Consulta";
import Comprovante from "./pages/Comprovante";
import LayoutAdmin from "./components/LayoutAdmin";
import { estaLogado } from "./services/auth";

function RotaProtegida({ children }) {
  return estaLogado() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/comprovante/:codigo" element={<Comprovante />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route
        path="/admin"
        element={
          <RotaProtegida>
            <LayoutAdmin />
          </RotaProtegida>
        }
      >
        <Route index element={<Dashboard />} />

        <Route
          path="nova-garantia"
          element={<NovaGarantia />}
        />

        <Route
          path="editar-garantia/:codigo"
          element={<EditarGarantia />}
        />

        <Route
          path="clientes"
          element={<Clientes />}
        />

        <Route
          path="estoque"
          element={<Estoque />}
        />

        <Route
          path="financeiro"
          element={<Financeiro />}
        />

        <Route
          path="configuracoes"
          element={<Configuracoes />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;