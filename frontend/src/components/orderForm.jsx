import { useState } from "react";
import api from "../services/api";

export default function OrderForm({ onCreated }) {
  const [form, setForm] = useState({ x: "", y: "", weight: "", priority: "baixa" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/orders", {
        x: Number(form.x),
        y: Number(form.y),
        weight: Number(form.weight),
        priority: form.priority,
      });
      onCreated();
      setForm({ x: "", y: "", weight: "", priority: "baixa" });
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <h3 className="text-lg font-bold mb-3">Novo Pedido</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          name="x"
          placeholder="Coordenada X"
          className="w-full border rounded-lg px-3 py-2"
          value={form.x}
          onChange={handleChange}
        />
        <input
          type="number"
          name="y"
          placeholder="Coordenada Y"
          className="w-full border rounded-lg px-3 py-2"
          value={form.y}
          onChange={handleChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="Peso (kg)"
          className="w-full border rounded-lg px-3 py-2"
          value={form.weight}
          onChange={handleChange}
        />
        <select
          name="priority"
          className="w-full border rounded-lg px-3 py-2"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Pedido"}
        </button>
      </form>
    </div>
  );
}
