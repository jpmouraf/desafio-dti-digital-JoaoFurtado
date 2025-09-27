import { useState } from "react";
import api from "../services/api";

export default function DroneForm({ onCreated }) {
  const [form, setForm] = useState({ limitWeight: "", limitDistance: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/drones", {
        limitWeight: Number(form.limitWeight),
        limitDistance: Number(form.limitDistance),
      });
      onCreated();
      setForm({ limitWeight: "", limitDistance: "" });
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao criar drone");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <h3 className="text-lg font-bold mb-3">Registrar Drone</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          name="limitWeight"
          placeholder="Capacidade (kg)"
          className="w-full border rounded-lg px-3 py-2"
          value={form.limitWeight}
          onChange={handleChange}
        />
        <input
          type="number"
          name="limitDistance"
          placeholder="Autonomia (km)"
          className="w-full border rounded-lg px-3 py-2"
          value={form.limitDistance}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Drone"}
        </button>
      </form>
    </div>
  );
}
