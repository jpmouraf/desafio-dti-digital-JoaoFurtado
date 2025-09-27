import { useState } from "react";
import DeliveryManager from "../components/deliveryManager";

export default function DeliveriesPage() {
  const [droneId, setDroneId] = useState("");
  const [deliveryId, setDeliveryId] = useState("");

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h2 className="text-3xl font-extrabold text-green-900 mb-6 flex items-center gap-2">
        📍 Entregas
      </h2>

      <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 mb-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">🔧 Configurações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="ID do Drone"
            value={droneId}
            onChange={(e) => setDroneId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="ID da Entrega"
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
      </div>

      <DeliveryManager
        droneId={droneId}
        deliveryId={deliveryId}
        onUpdated={() => console.log("Atualizado")}
      />
    </div>
  );
}
