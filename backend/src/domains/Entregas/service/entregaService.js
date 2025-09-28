import { deliveries, nextDeliveryId, orders } from "../../../db.js";
import { DeliveryStatus, DroneStatus, OrderStatus } from "../../../enums.js";
import { consumeBattery, allocateOrders } from "../../Drones/service/droneService.js";

function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export async function createDelivery(drone) {
  if (drone.statusDrone !== DroneStatus.IDLE) {
    throw new Error(`Drone não está disponível (status: ${drone.statusDrone}).`);
  }

  const allocatedOrders = await allocateOrders(drone);

  if (allocatedOrders.length === 0) {
    throw new Error("Nenhum pedido pôde ser alocado ao drone.");
  }

  let totalDistance = 0;
  let currentPosition = { x: 0, y: 0 };

  for (let order of allocatedOrders) {
    const dest = { x: order.x, y: order.y };
    totalDistance += distance(currentPosition, dest);
    currentPosition = dest;
  }
  totalDistance += distance(currentPosition, { x: 0, y: 0 });

  const totalWeight = allocatedOrders.reduce((acc, o) => acc + o.weight, 0);
  const baseConsumption = totalDistance * 1.5;
  const weightFactor = (totalWeight / drone.limitWeight) * 0.5;
  const expectedConsumption = baseConsumption * (1 + weightFactor);

  if (drone.battery < expectedConsumption) {
    throw new Error(
      `Bateria insuficiente (necessário ${expectedConsumption.toFixed(
        1
      )}%, disponível ${drone.battery}%).`
    );
  }

  const priorityMap = { alta: 3, media: 2, baixa: 1 };
  const orderSequence = [...allocatedOrders]
    .sort((a, b) => {
      if (priorityMap[b.priority] !== priorityMap[a.priority]) {
        return priorityMap[b.priority] - priorityMap[a.priority];
      }
      if (a.weight !== b.weight) return a.weight - b.weight;
      const distA = Math.sqrt(a.x * a.x + a.y * a.y);
      const distB = Math.sqrt(b.x * b.x + b.y * b.y);
      return distA - distB;
    })
    .map(o => o.id);

  const id = nextDeliveryId();
  const delivery = {
    id,
    droneId: drone.id,
    orders: allocatedOrders.map(o => o.id),
    totalDistance,
    status: DeliveryStatus.IN_PROGRESS,
    orderSequence,
  };

  deliveries.push(delivery);

  drone.statusDrone = DroneStatus.FLYING;
  drone.carriedWeight = totalWeight;
  await consumeBattery(drone, totalDistance);

  return delivery;
}

export async function finishDelivery(drone, delivery) {
  if (!delivery) {
    throw new Error("Entrega não encontrada.");
  }
  if (delivery.status !== DeliveryStatus.IN_PROGRESS) {
    throw new Error(`Entrega ${delivery.id} não pode ser finalizada (status atual: ${delivery.status}).`);
  }
  if (!drone) {
    throw new Error("Drone associado à entrega não encontrado.");
  }

  delivery.status = DeliveryStatus.FINISHED;

  for (let orderId of delivery.orders) {
    const order = orders.find(o => o.id === orderId);
    if (order) order.status = OrderStatus.DELIVERED;
  }

  drone.statusDrone = DroneStatus.RETURNING;
  drone.carriedWeight = 0;
  drone.deliveries++;

  drone.statusDrone = DroneStatus.IDLE;
  drone.position = { x: 0, y: 0 };

  return delivery;
}

export function generateReport() {
  const totalDeliveries = deliveries.length;
  const finished = deliveries.filter(d => d.status === DeliveryStatus.FINISHED).length;
  const inProgress = deliveries.filter(d => d.status === DeliveryStatus.IN_PROGRESS).length;
  const rejected = deliveries.filter(d => d.status === DeliveryStatus.REJECTED).length;

  const totalOrdersDelivered = deliveries
    .filter(d => d.status === DeliveryStatus.FINISHED)
    .reduce((acc, d) => acc + (d.orders?.length ?? 0), 0);

  const totalDistance = deliveries
    .filter(d => d.status === DeliveryStatus.FINISHED)
    .reduce((acc, d) => acc + (d.totalDistance ?? 0), 0);

  const droneStats = {};
  deliveries
    .filter(d => d.status === DeliveryStatus.FINISHED)
    .forEach(d => {
      if (!droneStats[d.droneId]) droneStats[d.droneId] = { deliveries: 0, distance: 0 };
      droneStats[d.droneId].deliveries += 1;
      droneStats[d.droneId].distance += d.totalDistance ?? 0;
    });

  const lastDelivery = deliveries.length ? deliveries[deliveries.length - 1] : null;
  const lastDeliverySummary = lastDelivery
    ? {
        id: lastDelivery.id,
        status: lastDelivery.status,
        orders: lastDelivery.orders,
        orderSequence: lastDelivery.orderSequence ?? lastDelivery.orders
      }
    : null;

  return {
    resumo: { totalDeliveries, finished, inProgress, rejected },
    pedidosEntregues: totalOrdersDelivered,
    distanciaTotalPercorrida: totalDistance,
    drones: droneStats,
    ultimaEntrega: lastDeliverySummary
  };
}
