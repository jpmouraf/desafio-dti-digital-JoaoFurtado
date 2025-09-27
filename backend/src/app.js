import express from "express";
import cors from "cors";
import orderRoutes from "./domains/Pedidos/controllers/pedidosRoute.js";
import droneRoutes from "./domains/Drones/controllers/droneRoute.js";
import deliveryRoutes from "./domains/Entregas/controllers/entregaRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);
app.use("/drones", droneRoutes);
app.use("/deliveries", deliveryRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
