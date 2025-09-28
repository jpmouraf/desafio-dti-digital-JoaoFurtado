import { useEffect, useState } from "react";
import api from "../services/api";

function DroneForm({ onCreated }) {
  const [form, setForm] = useState({ limitWeight: "", limitDistance: "" });

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/drones", {
        limitWeight: Number(form.limitWeight),
        limitDistance: Number(form.limitDistance)
      });
      setForm({ limitWeight: "", limitDistance: "" });
      onCreated();
    } catch (err) {
      alert("Erro: " + (err?.response?.data?.erro || err.message));
    }
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <input
        name="limitWeight"
        placeholder="Capacidade (kg)"
        value={form.limitWeight}
        onChange={change}
        required
        style={{ width: 140 }}
      />
      <input
        name="limitDistance"
        placeholder="Autonomia (km)"
        value={form.limitDistance}
        onChange={change}
        required
        style={{ width: 140, marginLeft: 6 }}
      />
      <button type="submit" style={{ marginLeft: 8 }}>Criar Drone</button>
    </form>
  );
}

export default function DronesPage() {
  const [drones, setDrones] = useState([]);

  async function load() {
    try {
      const res = await api.get("/drones");
      setDrones(res.data);
    } catch (err) {
      alert("Erro ao carregar drones: " + (err?.message || ""));
    }
  }

  async function recharge(id) {
    try {
      const res = await api.post(`/drones/recharge/${id}`);
      await load();
      alert(res.data.message);
    } catch (err) {
      alert("Erro ao recarregar: " + (err?.response?.data?.erro || err.message));
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Drones</h2>
      <DroneForm onCreated={load} />
      <button onClick={load} style={{ marginBottom: 8 }}>Atualizar lista</button>
      <ul>
        {drones.map(d => (
          <li key={d.id} style={{ marginBottom: 6 }}>
            <strong>Drone #{d.id}</strong> — Capacidade: {d.limitWeight}kg —
            Autonomia: {d.limitDistance}km — Status: {d.statusDrone} — Bateria: {d.battery}%
            <button onClick={() => recharge(d.id)} style={{ marginLeft: 8 }}>
              🔋 Recarregar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
