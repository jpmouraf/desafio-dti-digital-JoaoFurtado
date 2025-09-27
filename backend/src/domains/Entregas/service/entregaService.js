import { deliveries, nextDeliveryId, orders } from "../../../db.js";
import { DeliveryStatus, DroneStatus, OrderStatus } from "../../../enums.js";
import { consumeBattery } from "../../Drones/service/droneService.js";

function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export async function createDelivery(drone, allocatedOrders) {
  if (allocatedOrders.length === 0) return null;

  let totalDistance = 0;
  let currentPosition = { x: 0, y: 0 };

  for (let order of allocatedOrders) {
    totalDistance += distance(currentPosition, { x: order.x, y: order.y });
    currentPosition = { x: order.x, y: order.y };
  }

  totalDistance += distance(currentPosition, { x: 0, y: 0 });

  if (totalDistance > drone.limitDistance) {
    allocatedOrders.forEach(o => (o.status = OrderStatus.WAITING));
    return null;
  }

  await consumeBattery(drone, totalDistance);

  const delivery = {
    id: nextDeliveryId(),
    droneId: drone.id,
    orders: allocatedOrders.map(o => o.id),
    totalDistance,
    status: DeliveryStatus.IN_PROGRESS,
    startedAt: Date.now(),
    finishedAt: null
  };

  deliveries.push(delivery);
  drone.statusDrone = DroneStatus.FLYING;

  return delivery;
}

export async function finishDelivery(drone, delivery) {
  delivery.status = DeliveryStatus.FINISHED;
  delivery.finishedAt = Date.now();

  for (let orderId of delivery.orders) {
    const order = orders.find(o => o.id === orderId);
    if (order) order.status = OrderStatus.DELIVERED;
  }

  drone.statusDrone = DroneStatus.RETURNING;
  drone.carriedWeight = 0;
  drone.deliveries++;

  setTimeout(() => {
    drone.statusDrone = DroneStatus.IDLE;
  }, 1000);

  return delivery;
}

export async function getDeliveryRoute(req, res) {
  const { id } = req.params;
  const delivery = deliveries.find(d => d.id == id);
  if (!delivery) return res.status(404).json({ erro: "Entrega não encontrada" });

  const route = delivery.orders.map(orderId => {
    const o = orders.find(x => x.id === orderId);
    return { id: o.id, x: o.x, y: o.y };
  });

  return res.json({ deliveryId: delivery.id, route });
}
