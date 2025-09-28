import { drones, orders, nextDroneId } from "../../../db.js";
import { DroneStatus, OrderStatus } from "../../../enums.js";

export async function createDrone(req, res) {
  const { limitWeight, limitDistance } = req.body;

  if (limitWeight == null || limitDistance == null) {
    return res.status(400).json({ erro: "Informe capacidade de peso e distância" });
  }

  const drone = {
    id: nextDroneId(),
    limitWeight,
    limitDistance,
    battery: 100,
    position: { x: 0, y: 0 },
    statusDrone: DroneStatus.IDLE,
    carriedWeight: 0,
    deliveries: 0
  };

  if (limitWeight <= 0 || limitDistance <= 0) {
    return res.status(400).json({ erro: "Capacidade de peso e distância devem ser maiores que zero" });
  }

  drones.push(drone);
  return res.status(201).json(drone);
}

export async function listDrones(req, res) {
  return res.json(drones);
}

export async function getDroneStatus(req, res) {
  const { id } = req.params;
  const drone = drones.find(d => d.id == id);
  if (!drone) return res.status(404).json({ erro: "Drone não encontrado" });
  return res.json(drone);
}

export async function allocateOrders(drone) {
  if (!drone || drone.statusDrone !== DroneStatus.IDLE) return [];

  let allocated = [];
  let totalWeight = 0;
  const priorities = { alta: 3, media: 2, baixa: 1 };

  const waitingOrders = orders.filter(o => o.status === OrderStatus.WAITING);

  const sortedOrders = [...waitingOrders].sort((a, b) => {
    if (priorities[b.priority] !== priorities[a.priority]) {
      return priorities[b.priority] - priorities[a.priority];
    }
    if (a.weight !== b.weight) {
      return b.weight - a.weight; 
    }
    const distA = Math.sqrt(a.x * a.x + a.y * a.y);
    const distB = Math.sqrt(b.x * b.x + b.y * b.y);
    return distA - distB;
  });

  for (let order of sortedOrders) {
    if (totalWeight + order.weight <= drone.limitWeight) {
      order.status = OrderStatus.IN_DELIVERY;
      allocated.push(order);
      totalWeight += order.weight;
    }
  }

  if (allocated.length > 0) {
    drone.statusDrone = DroneStatus.LOADING;
    drone.carriedWeight = totalWeight;
  }

  return allocated;
}

export async function consumeBattery(drone, distance) {
  const baseConsumption = distance * 1.5;
  const weightFactor = (drone.carriedWeight / drone.limitWeight) * 0.5;
  const consumption = baseConsumption * (1 + weightFactor);
  
  drone.battery -= consumption;
  if (drone.battery < 0) drone.battery = 0;

  if (drone.battery === 0) {
    drone.statusDrone = DroneStatus.NO_BATTERY;
  }
  return drone;
}

export async function rechargeDrone(req, res) {
  try {
    const { id } = req.params;
    const drone = drones.find(d => d.id == id); 
    if (!drone) {
      return res.status(404).json({ erro: "Drone não encontrado" });
    }

    if (drone.statusDrone !== DroneStatus.IDLE) { 
      return res.status(400).json({ erro: "Drone está em entrega, não pode recarregar agora" });
    }

    drone.battery = 100;
    drone.statusDrone = DroneStatus.IDLE;

    return res.json({ message: `Drone ${id} recarregado com sucesso!`, drone });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}