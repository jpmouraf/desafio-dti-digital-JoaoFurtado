import { useEffect, useState } from "react";
import api from "../services/api";
import DroneForm from "../components/droneForm";

export default function DronesPage() {
  const [drones, setDrones] = useState([]);

  async function loadDrones() {
    const res = await api.get("/drones");
    setDrones(res.data);
  }

  useEffect(() => {
    loadDrones();
  }, []);

  function getStatusStyle(status) {
    switch (status) {
      case "Idle": return "bg-green-100 text-green-700";
      case "Carregando":
      case "Em voo": return "bg-yellow-100 text-yellow-700";
      case "Sem bateria": return "bg-red-100 text-red-700";
      case "Retornando": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center gap-2">
        🚁 Drones
      </h2>

      <DroneForm onCreated={loadDrones} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {drones.map((d) => (
          <div
            key={d.id}
            className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-blue-700 mb-2">
              Drone #{d.id}
            </h3>
            <p><span className="font-semibold">⚖️ Capacidade:</span> {d.limitWeight}kg</p>
            <p><span className="font-semibold">🛫 Autonomia:</span> {d.limitDistance}km</p>
            <p><span className="font-semibold">🔋 Bateria:</span> {d.battery}%</p>
            <p className={`inline-block mt-3 px-3 py-1 rounded-lg text-sm font-medium ${getStatusStyle(d.statusDrone)}`}>
              {d.statusDrone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
