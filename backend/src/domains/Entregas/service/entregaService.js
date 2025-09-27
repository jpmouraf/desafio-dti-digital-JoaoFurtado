let deliveries = [];
let deliveryId = 1;

function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export async function createDelivery(drone, orders) {
  if (orders.length === 0) {
    return null;
  }

  let totalDistance = 0;
  let currentPosition = { x: 0, y: 0 };

  for (let order of orders) {
    totalDistance += distance(currentPosition, { x: order.x, y: order.y });
    currentPosition = { x: order.x, y: order.y };
  }

  totalDistance += distance(currentPosition, { x: 0, y: 0 });

  const delivery = {
    id: deliveryId++,
    droneId: drone.id,
    orders: orders.map(o => o.id),
    totalDistance,
    status: "Em andamento",
    startedAt: Date.now(),
    finishedAt: null
  };

  deliveries.push(delivery);

  drone.statusDrone = "Em voo";

  return delivery;
}

export async function finishDelivery(drone, delivery) {
  delivery.status = "Concluida";
  delivery.finishedAt = Date.now();

  for (let orderId of delivery.orders) {
    const order = orders.find(o => o.id === orderId);
    if (order) order.status = "entregue";
  }

  drone.statusDrone = "Retornando";
  drone.carriedWeight = 0;
  drone.deliveries++;

  setTimeout(() => {
    drone.statusDrone = "Idle";
  }, 1000);

  return delivery;
}
