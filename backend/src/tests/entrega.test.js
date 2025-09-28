import request from "supertest";
import app from "../app.js";

describe("Deliveries API", () => {
  let droneId;

  beforeAll(async () => {
    const d = await request(app)
      .post("/drones")
      .send({ limitWeight: 10, limitDistance: 100 });
    droneId = d.body.id;

    await request(app)
      .post("/orders")
      .send({ x: 1, y: 1, weight: 3, priority: "alta" });
  });

  it("deve criar entrega automaticamente", async () => {
    const res = await request(app).post(`/deliveries/create/${droneId}`);
    expect(res.status).toBe(201);
    expect(res.body.entrega).toHaveProperty("orders");
    expect(res.body.entrega.orders.length).toBeGreaterThan(0);
  });

  it("deve finalizar entrega", async () => {
    const res = await request(app).get("/deliveries");
    const delivery = res.body[0];

    const finish = await request(app).post(
      `/deliveries/finish/${delivery.id}`
    );
    expect(finish.status).toBe(200);
    expect(finish.body.entrega.status).toBe("Concluída");
  });
});
