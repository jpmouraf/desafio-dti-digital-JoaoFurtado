export const orders = [];
export const drones = [];
export const deliveries = [];

export let orderId = 1;
export let droneId = 1;
export let deliveryId = 1;

export function nextOrderId() {
  return orderId++;
}

export function nextDroneId() {
  return droneId++;
}

export function nextDeliveryId() {
  return deliveryId++;
}
