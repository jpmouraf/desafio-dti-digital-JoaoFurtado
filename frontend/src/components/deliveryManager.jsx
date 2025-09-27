import api from "../services/api";
import { useState } from "react";

export default function DeliveryManager({ droneId, deliveryId, onUpdated }) {
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      await api.post(`/deliveries/create/${droneId}`);
      onUpdated();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao criar entrega");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    setLoading(true);
    try {
      await api.post(`/deliveries/finish/${deliveryId}`);
      onUpdated();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao finalizar entrega");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-4">
      <h3 className="text-lg font-bold mb-3">Gerenciar Entrega</h3>
      <div className="flex gap-3">
        <button
          onClick={handleCreate}
          disabled={!droneId || loading}
          className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Processando..." : "Criar Entrega"}
        </button>
        {deliveryId && (
          <button
            onClick={handleFinish}
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Finalizando..." : "Finalizar Entrega"}
          </button>
        )}
      </div>
    </div>
  );
}
