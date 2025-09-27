import { Router } from "express";
import { createDrone, listDrones } from "../services/coreService.js";

const router = Router();

router.post("/", createDrone);

router.get("/", listDrones);

export default router;
