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

  return (
    <div>
      <h2>Drones</h2>
      <DroneForm onCreated={loadDrones} />
      <ul>
        {drones.map(d => (
          <li key={d.id}>
            Drone #{d.id} - Capacidade: {d.limitWeight}kg - Autonomia: {d.limitDistance}km - Status: {d.statusDrone} - Bateria: {d.battery}%
          </li>
        ))}
      </ul>
    </div>
  );
}
