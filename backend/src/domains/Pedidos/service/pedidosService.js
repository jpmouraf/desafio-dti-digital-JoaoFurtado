import { orders, nextOrderId } from "../../../db.js";
import { OrderStatus } from "../../../enums.js";

export async function createOrder(req, res) {
  const { x, y, weight, priority } = req.body;

  if (x == null || y == null || weight == null || !priority) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  if (weight > 10) {
    return res.status(400).json({ erro: "Peso acima da capacidade do drone de 10kg." });
  }

  if (weight <= 0) {
    return res.status(400).json({ erro: "Não é possível ter um peso nulo ou negativo." });
  }

  const order = { 
    id: nextOrderId(),
    x, 
    y, 
    weight, 
    priority, 
    status: OrderStatus.WAITING 
  };

  orders.push(order);
  return res.status(201).json(order);
}

export async function listOrders(req, res) {
  return res.json(orders);
}
