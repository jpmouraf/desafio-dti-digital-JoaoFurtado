let drones = [];
let droneId = 1;

export async function createDrone(req, res) {
  const { limitWeight, limitDistance } = req.body;

  if (!limitWeight || !limitDistance) {
    return res.status(400).json({ erro: "Informe capacidade de peso e distância" });
  }

  const drone = {
    id: droneId++,
    limitWeight,
    limitDistance,
    battery: 100, 
    position: { x: 0, y: 0 },
    statusDrone: "Idle",
    carriedWeight: 0,
    deliveries: 0
  };

  drones.push(drone);
  return res.status(201).json(drone);
}

export async function listDrones(req, res) {
  return res.json(drones);
}

export async function allocateOrders(drone, orders) {
  let allocated = [];
  let totalWeight = 0;

  const sortedOrders = [...orders].sort((a, b) => {
    const priorities = { alta: 3, media: 2, baixa: 1 };

    if (priorities[b.priority] !== priorities[a.priority]) {
      return priorities[b.priority] - priorities[a.priority];
    }

    if (a.weight !== b.weight) {
      return a.weight - b.weight;
    }

    const distA = Math.sqrt(a.x * a.x + a.y * a.y);
    const distB = Math.sqrt(b.x * b.x + b.y * b.y);
    return distA - distB;
  });

  for (let order of sortedOrders) {
    if (order.status === "aguardando") {
      if (totalWeight + order.weight <= drone.limitWeight) {
        order.status = "em_entrega";
        allocated.push(order);
        totalWeight += order.weight;
      }
    }
  }

  if (allocated.length > 0) {
    drone.statusDrone = "Carregando";
    drone.carriedWeight = totalWeight;
  }

  return allocated;
}


export async function consumeBattery(drone, distance) {
  const consumption = distance * 2; 
  drone.battery -= consumption;
  if (drone.battery < 0) drone.battery = 0;

  if (drone.battery === 0) {
    drone.statusDrone = "Sem bateria";
  }

  return drone;
}

export async function rechargeBattery(drone) {
  drone.battery = 100;
  drone.statusDrone = "Idle";
  drone.carriedWeight = 0;
  return drone;
}
