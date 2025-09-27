import { useState } from "react";
import api from "../services/api";

export default function Orders() {
  const [form, setForm] = useState({ x: "", y: "", peso: "", prioridade: "baixa" });
  const [mensagem, setMensagem] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/orders", form);
      setMensagem("Pedido criado com sucesso!");
    } catch (err) {
      setMensagem("Erro: " + err.response.data.erro);
    }
  }

  return (
    <div>
      <h2>Novo Pedido</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="x" placeholder="Coordenada X" value={form.x} onChange={handleChange} />
        <input type="number" name="y" placeholder="Coordenada Y" value={form.y} onChange={handleChange} />
        <input type="number" name="peso" placeholder="Peso (kg)" value={form.peso} onChange={handleChange} />
        <select name="prioridade" value={form.prioridade} onChange={handleChange}>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        <button type="submit">Criar Pedido</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}