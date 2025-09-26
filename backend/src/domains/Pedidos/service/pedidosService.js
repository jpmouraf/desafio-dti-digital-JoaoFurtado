let orders = [];
let id = 1;

export async function createOrder(req, res) {
  const { x, y, weight, priority} = req.body;

  if (!x || !y || !weight || !priority) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  if (peso > 10) {
    return res.status(400).json({ erro: "Peso acima da capacidade do drone de 10kg" });
  }

  const order = { id: id++, x, y, weight, priority, status: "aguardando" };
  pedidos.push(order);

  return res.status(201).json(order);
}

export async function listOrders(req, res) {
  return res.json(orders);
}
