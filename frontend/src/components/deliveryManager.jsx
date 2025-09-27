import api from "../services/api";

export default function DeliveryManager({ droneId, deliveryId, onUpdated }) {
  async function handleCreate() {
    try {
      await api.post(`/deliveries/create/${droneId}`);
      onUpdated();
    } catch (err) {
      alert("Erro ao criar entrega: " + err.response.data.erro);
    }
  }

  async function handleFinish() {
    try {
      await api.post(`/deliveries/finish/${deliveryId}`);
      onUpdated();
    } catch (err) {
      alert("Erro ao finalizar entrega");
    }
  }

  return (
    <div>
      <button onClick={handleCreate}>Criar Entrega</button>
      {deliveryId && <button onClick={handleFinish}>Finalizar Entrega</button>}
    </div>
  );
}
