import { Routes, Route, Link } from "react-router-dom";
import OrdersPage from "./pages/orderPage";
import DronesPage from "./pages/dronePage";
import DeliveriesPage from "./pages/deliveryPage";

function App() {
  return (
    <div>
      <h1>🚁 Sistema de Entregas por Drones</h1>

      {/* Menu de navegação */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/orders" style={{ marginRight: "15px" }}>Pedidos</Link>
        <Link to="/drones" style={{ marginRight: "15px" }}>Drones</Link>
        <Link to="/deliveries">Entregas</Link>
      </nav>

      {/* Definição das rotas */}
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/drones" element={<DronesPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
      </Routes>
    </div>
  );
}

export default App;
