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

  return (
    <div>
      <h2>Pedidos</h2>
      <OrderForm onCreated={loadOrders} />
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            #{o.id} - ({o.x},{o.y}) - {o.weight}kg - prioridade {o.priority} - {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
