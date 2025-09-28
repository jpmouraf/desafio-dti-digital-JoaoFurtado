import { useEffect, useState } from "react";
import api from "../services/api";

export default function DeliveriesPage() {
  const [drones, setDrones] = useState([]);
  const [selectedDroneId, setSelectedDroneId] = useState("");
  const [lastDelivery, setLastDelivery] = useState(null);
  const [finishId, setFinishId] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);

  async function load() {
    try {
      const [dRes, delRes, oRes] = await Promise.all([
        api.get("/drones"),
        api.get("/deliveries"),
        api.get("/orders"),
      ]);
      setDrones(dRes.data);
      setDeliveries(delRes.data);
      setOrders(oRes.data);
    } catch (err) {
      alert("Erro ao carregar dados: " + (err?.message || ""));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createDelivery() {
    if (!selectedDroneId) return alert("Escolha um drone.");

    try {
      const res = await api.post(`/deliveries/create/${selectedDroneId}`);
      setLastDelivery(res.data.entrega);
      setSelectedDroneId("");
      await load();
    } catch (err) {
      alert(
        "Erro ao criar entrega: " +
          (err?.response?.data?.erro || err.message)
      );
    }
  }

  async function finishDelivery() {
    if (!finishId) return alert("Informe o ID da entrega para finalizar.");
    try {
      const res = await api.post(`/deliveries/finish/${finishId}`);
      alert("Entrega finalizada: ID " + res.data.entrega.id);
      setFinishId("");
      await load();
    } catch (err) {
      alert(
        "Erro ao finalizar entrega: " +
          (err?.response?.data?.erro || err.message)
      );
    }
  }

  function statusColor(status) {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "FINISHED":
        return "bg-green-100 text-green-800 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gerenciar Entregas</h2>

      {/* Lista de pedidos em espera */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold">Pedidos em espera</h3>
        <ul className="mt-2 space-y-1">
          {orders
            .filter((o) => o.status === "aguardando")
            .map((o) => (
              <li key={o.id}>
                <strong>#{o.id}</strong> — ({o.x},{o.y}) — {o.weight}kg —{" "}
                {o.priority}
              </li>
            ))}
        </ul>
        {orders.filter((o) => o.status === "aguardando").length === 0 && (
          <p className="text-gray-500">Nenhum pedido aguardando entrega.</p>
        )}
      </section>

      {/* Escolher drone */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold">Criar nova entrega</h3>
        <div className="flex gap-2 mt-2">
          <select
            value={selectedDroneId}
            onChange={(e) => setSelectedDroneId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">-- selecione um drone --</option>
            {drones.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.id} — cap {d.limitWeight}kg / {d.limitDistance}km —{" "}
                status {d.statusDrone}
              </option>
            ))}
          </select>
          <button
            onClick={createDelivery}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Criar Entrega
          </button>
        </div>
      </section>

      {/* Finalizar entrega */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold">Finalizar entrega</h3>
        <div className="flex gap-2 mt-2">
          <input
            placeholder="ID da entrega"
            value={finishId}
            onChange={(e) => setFinishId(e.target.value)}
            className="border px-2 py-1 rounded w-40"
          />
          <button
            onClick={finishDelivery}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Finalizar
          </button>
        </div>
      </section>

      {/* Última entrega criada */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold">Última entrega criada</h3>
        {lastDelivery ? (
          <div className="border rounded p-4 bg-gray-50">
            <p>
              <strong>ID:</strong> {lastDelivery.id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded border ${statusColor(
                  lastDelivery.status
                )}`}
              >
                {lastDelivery.status}
              </span>
            </p>
            <p>
              <strong>Pedidos:</strong> {lastDelivery.orders.join(", ")}
            </p>
            <p>
              <strong>Ordem de entrega:</strong>{" "}
              {lastDelivery.orderSequence?.join(" → ")}
            </p>
          </div>
        ) : (
          <p>Nenhuma entrega criada nesta sessão.</p>
        )}
      </section>

      {/* Lista de entregas */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Entregas existentes</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {deliveries.map((d) => (
            <div
              key={d.id}
              className={`border rounded p-3 shadow-sm ${statusColor(
                d.status
              )}`}
            >
              <p>
                <strong>ID:</strong> {d.id}
              </p>
              <p>
                <strong>Drone:</strong> #{d.droneId}
              </p>
              <p>
                <strong>Status:</strong> {d.status}
              </p>
              <p>
                <strong>Pedidos:</strong> {d.orders.join(", ")}
              </p>
              <p>
                <strong>Distância:</strong>{" "}
                {d.totalDistance?.toFixed(1)} km
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
