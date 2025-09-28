import { useEffect, useState } from "react";
import api from "../services/api";

function OrderForm({ onCreated }) {
  const [form, setForm] = useState({ x: "", y: "", weight: "", priority: "baixa" });

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/orders", {
        x: Number(form.x),
        y: Number(form.y),
        weight: Number(form.weight),
        priority: form.priority
      });
      setForm({ x: "", y: "", weight: "", priority: "baixa" });
      onCreated();
    } catch (err) {
      alert("Erro: " + (err?.response?.data?.erro || err.message));
    }
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <input name="x" placeholder="X" value={form.x} onChange={change} required style={{ width: 80 }} />
      <input name="y" placeholder="Y" value={form.y} onChange={change} required style={{ width: 80, marginLeft: 6 }} />
      <input name="weight" placeholder="Peso (kg)" value={form.weight} onChange={change} required style={{ width: 110, marginLeft: 6 }} />
      <select name="priority" value={form.priority} onChange={change} style={{ marginLeft: 6 }}>
        <option value="baixa">baixa</option>
        <option value="media">media</option>
        <option value="alta">alta</option>
      </select>
      <button type="submit" style={{ marginLeft: 8 }}>Criar Pedido</button>
    </form>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(0);

  async function load() {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      alert("Erro ao carregar pedidos: " + (err?.message || ""));
    }
  }

  useEffect(() => { load(); }, [refresh]);

  return (
    <div>
      <h2>Pedidos</h2>
      <OrderForm onCreated={() => setRefresh(s => s + 1)} />
      <button onClick={load} style={{ marginBottom: 8 }}>Atualizar lista</button>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            <strong>#{o.id}</strong> — ({o.x},{o.y}) — {o.weight}kg — {o.priority} — <em>{o.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
