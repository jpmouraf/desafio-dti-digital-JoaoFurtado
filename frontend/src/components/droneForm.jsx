import { useState } from "react";
import api from "../services/api";

export default function DroneForm({ onCreated }) {
  const [form, setForm] = useState({ limitWeight: "", limitDistance: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/drones", form);
      onCreated();
      setForm({ limitWeight: "", limitDistance: "" });
    } catch (err) {
      alert("Erro ao criar drone");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="limitWeight" placeholder="Capacidade (kg)" value={form.limitWeight} onChange={handleChange} />
      <input type="number" name="limitDistance" placeholder="Autonomia (km)" value={form.limitDistance} onChange={handleChange} />
      <button type="submit">Criar Drone</button>
    </form>
  );
}
