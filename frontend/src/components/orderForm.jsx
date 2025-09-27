import { useState } from "react";
import api from "../services/api";

export default function OrderForm({ onCreated }) {
  const [form, setForm] = useState({ x: "", y: "", weight: "", priority: "baixa" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/orders", form);
      onCreated();
      setForm({ x: "", y: "", weight: "", priority: "baixa" });
    } catch (err) {
      alert("Erro ao criar pedido: " + err.response.data.erro);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="x" placeholder="X" value={form.x} onChange={handleChange} />
      <input type="number" name="y" placeholder="Y" value={form.y} onChange={handleChange} />
      <input type="number" name="weight" placeholder="Peso (kg)" value={form.weight} onChange={handleChange} />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>
      <button type="submit">Criar Pedido</button>
    </form>
  );
}
