import { useEffect, useState } from "react";
import api from "../services/api";
import OrderForm from "../components/orderForm";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const res = await api.get("/orders");
    setOrders(res.data);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function getPriorityStyle(priority) {
    switch (priority) {
      case "alta": return "bg-red-100 text-red-700";
      case "media": return "bg-yellow-100 text-yellow-700";
      case "baixa": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 flex items-center gap-2">
        📦 Pedidos
      </h2>

      <OrderForm onCreated={loadOrders} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-blue-700 mb-2">
              Pedido #{o.id}
            </h3>
            <p><span className="font-semibold">📍 Local:</span> ({o.x}, {o.y})</p>
            <p><span className="font-semibold">⚖️ Peso:</span> {o.weight}kg</p>
            <p>
              <span className="font-semibold">⭐ Prioridade:</span>{" "}
              <span className={`px-2 py-1 rounded-lg text-sm font-medium ${getPriorityStyle(o.priority)}`}>
                {o.priority}
              </span>
            </p>
            <p className="mt-2">
              <span className="font-semibold">📌 Status:</span> {o.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
