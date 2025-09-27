import { Router } from "express";
import { createOrder, listOrders } from "../services/coreService.js";

const router = Router();

router.post("/", createOrder);

router.get("/", listOrders);

export default router;
