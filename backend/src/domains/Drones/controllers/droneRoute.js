import { Router } from "express";
import { createDrone, listDrones, getDroneStatus } from "../service/droneService.js";

const router = Router();

router.post("/", createDrone);

router.get("/", listDrones);

router.get("/:id/status", getDroneStatus);

export default router;
