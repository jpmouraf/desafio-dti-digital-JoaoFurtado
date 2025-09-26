import { Router } from "express";
import * as orderService from "../service/pedidosService.js";

const router = Router();

router.post("/", (req, res) => {
  try {
    const order = orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", (req, res) => {
  const orders = orderService.listOrders();
  res.json(orders);
});

export default router;
