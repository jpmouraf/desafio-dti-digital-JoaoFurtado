import { OrderStatus, DroneStatus, DeliveryStatus } from "./enums.js";

export const orders = [
  { id: 1, x: 2, y: 3, weight: 5, priority: "alta", status: OrderStatus.WAITING },
  { id: 2, x: -1, y: 4, weight: 3, priority: "media", status: OrderStatus.WAITING },
  { id: 3, x: 6, y: 2, weight: 7, priority: "baixa", status: OrderStatus.WAITING }
];

export const drones = [
  { id: 1, limitWeight: 10, limitDistance: 30, battery: 100, position: { x: 0, y: 0 }, statusDrone: DroneStatus.IDLE, carriedWeight: 0, deliveries: 0 },
  { id: 2, limitWeight: 8, limitDistance: 20, battery: 100, position: { x: 0, y: 0 }, statusDrone: DroneStatus.IDLE, carriedWeight: 0, deliveries: 0 }
];

export const deliveries = [];

let orderIdCounter = orders.length + 1;
let droneIdCounter = drones.length + 1;
let deliveryIdCounter = 1;

export function nextOrderId() {
  return orderIdCounter++;
}
export function nextDroneId() {
  return droneIdCounter++;
}
export function nextDeliveryId() {
  return deliveryIdCounter++;
}
