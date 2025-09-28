import { Routes, Route, NavLink } from "react-router-dom";
import OrdersPage from "./pages/orderPage";
import DronesPage from "./pages/dronePage";
import DeliveriesPage from "./pages/deliveryPage";
import ReportPage from "./pages/reportPage";

function App() {
  const active = { fontWeight: "bold", textDecoration: "underline" };
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <header>
        <h1>🚁 Sistema de Entregas por Drones</h1>
        <nav style={{ marginBottom: 20 }}>
          <NavLink to="/orders" style={({isActive}) => (isActive ? active : undefined)}>Pedidos</NavLink>{" | "}
          <NavLink to="/drones" style={({isActive}) => (isActive ? active : undefined)}>Drones</NavLink>{" | "}
          <NavLink to="/deliveries" style={({isActive}) => (isActive ? active : undefined)}>Entregas</NavLink>{" | "}
          <NavLink to="/report" style={({isActive}) => (isActive ? active : undefined)}>Relatório</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<OrdersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/drones" element={<DronesPage />} />
          <Route path="/deliveries" element={<DeliveriesPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
