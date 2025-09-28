import { Router } from "express";
import { createDelivery, finishDelivery, generateReport } from "../../Entregas/service/entregaService.js";
import { drones, deliveries } from "../../../db.js";

const router = Router();

router.post("/create/:droneId", async (req, res) => {
  try {
    const { droneId } = req.params;
    const drone = drones.find(d => d.id == droneId);
    if (!drone) return res.status(404).json({ erro: "Drone não encontrado" });

    const delivery = await createDelivery(drone);
    const sequenceLine = delivery.orderSequence.join(" -> ");

    return res.status(201).json({
      sucesso: `Entrega ${delivery.id} criada com sucesso.`,
      ordemDasEntregas: sequenceLine,
      entrega: delivery,
    });
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
});

router.post("/finish/:deliveryId", async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const delivery = deliveries.find(d => d.id == deliveryId);
    if (!delivery) return res.status(404).json({ erro: "Entrega não encontrada" });

    const drone = drones.find(d => d.id == delivery.droneId);
    const result = await finishDelivery(drone, delivery);

    return res.json({
      sucesso: `Entrega ${result.id} finalizada com sucesso.`,
      entrega: result,
    });
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
});

router.get("/report", (req, res) => {
  const report = generateReport();
  res.json(report);
});

router.get("/", (req, res) => {
  res.json(deliveries);
});

export default router;
