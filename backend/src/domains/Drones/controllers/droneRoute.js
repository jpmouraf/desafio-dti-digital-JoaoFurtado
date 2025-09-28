import { Router } from "express";
import { createDrone, listDrones, getDroneStatus, rechargeDrone } from "../service/droneService.js";

const router = Router();

router.post("/", createDrone);

router.get("/", listDrones);

router.get("/:id/status", getDroneStatus);

router.post("/recharge/:id", rechargeDrone);

export default router;
