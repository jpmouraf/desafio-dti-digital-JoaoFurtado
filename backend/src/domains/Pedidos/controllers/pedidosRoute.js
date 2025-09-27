import { Router } from "express";
import { createOrder, listOrders } from "../service/pedidosService.js";

const router = Router();

router.post("/", createOrder);

router.get("/", listOrders);

export default router;
