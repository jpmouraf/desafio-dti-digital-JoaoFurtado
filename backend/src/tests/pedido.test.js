import request from "supertest";
import app from "../app.js";

describe("Orders API", () => {
  it("deve criar um pedido válido", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ x: 2, y: 3, weight: 5, priority: "alta" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("aguardando");
  });

  it("não deve criar pedido com peso acima de 10kg", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ x: 1, y: 1, weight: 15, priority: "media" });
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/Peso acima/);
  });

  it("não deve criar pedido com peso inválido", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ x: 1, y: 1, weight: 0, priority: "baixa" });
    expect(res.status).toBe(400);
  });
});
