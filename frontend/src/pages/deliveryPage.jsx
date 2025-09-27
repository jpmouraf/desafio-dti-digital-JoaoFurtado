import { useState } from "react";
import DeliveryManager from "../components/deliveryManager";

export default function DeliveriesPage() {
  const [droneId, setDroneId] = useState("");
  const [deliveryId, setDeliveryId] = useState("");

  return (
    <div>
      <h2>Entregas</h2>
      <input type="number" placeholder="ID do Drone" value={droneId} onChange={e => setDroneId(e.target.value)} />
      <input type="number" placeholder="ID da Entrega" value={deliveryId} onChange={e => setDeliveryId(e.target.value)} />
      <DeliveryManager droneId={droneId} deliveryId={deliveryId} onUpdated={() => console.log("Atualizado")} />
    </div>
  );
}
