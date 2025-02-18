import request from "supertest";
import app from "../index";

describe("GET /api/user", () => {
  it("should return user data", async () => {
    const response = await request(app).get("/api/user");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User data" });
  });
});