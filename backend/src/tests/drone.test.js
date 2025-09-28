import request from "supertest";
import app from "../app.js";

describe("Drones API", () => {
  it("deve criar drone válido", async () => {
    const res = await request(app)
      .post("/drones")
      .send({ limitWeight: 10, limitDistance: 50 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.battery).toBe(100);
  });

  it("não deve criar drone inválido", async () => {
    const res = await request(app)
      .post("/drones")
      .send({ limitWeight: 0, limitDistance: 0 });
    expect(res.status).toBe(400);
  });
});
