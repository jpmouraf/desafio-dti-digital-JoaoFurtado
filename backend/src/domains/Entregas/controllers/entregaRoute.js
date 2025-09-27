import { Router } from "express";
import { createDelivery, finishDelivery, getDeliveryRoute } from "../../Entregas/service/entregaService.js";
import { drones, deliveries, orders } from "../../../db.js";
import { allocateOrders } from "../../Drones/service/droneService.js";

const router = Router();

router.post("/create/:droneId", async (req, res) => {
  const { droneId } = req.params;
  const drone = drones.find(d => d.id == droneId);
  if (!drone) return res.status(404).json({ erro: "Drone não encontrado" });

  const allocated = await allocateOrders(drone, orders);
  if (allocated.length === 0) return res.status(400).json({ erro: "Nenhum pedido alocado" });

  const delivery = await createDelivery(drone, allocated);
  if (!delivery) return res.status(400).json({ erro: "Pedidos excedem limite de distância do drone" });

  res.status(201).json(delivery);
});

router.post("/finish/:deliveryId", async (req, res) => {
  const { deliveryId } = req.params;
  const delivery = deliveries.find(d => d.id == deliveryId);
  if (!delivery) return res.status(404).json({ erro: "Entrega não encontrada" });

  const drone = drones.find(d => d.id == delivery.droneId);
  const result = await finishDelivery(drone, delivery);

  res.json(result);
});

router.get("/:id/rota", getDeliveryRoute);

export default router;
