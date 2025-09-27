import express from "express";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import droneRoutes from "./routes/droneRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);
app.use("/drones", droneRoutes);
app.use("/deliveries", deliveryRoutes);

export default app;
