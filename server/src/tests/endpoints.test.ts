import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import prisma from "../prismaClient";
import fs from "fs";

const fileBuffer = fs.readFileSync("./src/tests/test.pdf");
describe("Endpoint Check", () => {
  let authCookie1: string = "";
  let authCookie2: string = "";
  let sessionId: number;
  // LOGIN AND REGISTER
  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "testUser123121", password: "testuser12312" });
    await request(app)
      .post("/api/auth/register")
      .send({ username: "testUser1231212", password: "testuser12312" });
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ username: "testUser123121", password: "testuser12312" });
    const loginResponse2 = await request(app)
      .post("/api/auth/login")
      .send({ username: "testUser1231212", password: "testuser12312" });
    authCookie1 = loginResponse.header["set-cookie"][0];
    authCookie2 = loginResponse2.header["set-cookie"][0];
  });
  // CHECK AUTH TEST
  describe("Auth Check", () => {
    it("return 401 for invalid token", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
    });
  });
  // FILE UPLOAD IF INVALID FORMAT
  describe("file upload test", () => {
    it("throw 400 on non pdf File", async () => {
      const data = await request(app)
        .post("/api/documents/")
        .attach("pdf", Buffer.from("fake content"), "test.txt")
        .set("Cookie", authCookie1);
      expect(data.status).toBe(400);
    });
    it("throw 401 on unauthorized file upload", async () => {
      const data = await request(app)
        .post("/api/documents")
        .attach("pdf", Buffer.from("bananas?"), "test.pdf")
        .set("Cookie", "1231231231");

      expect(data.status).toBe(401);
    });
    it("throw 201 on file upload", async () => {
      const data = await request(app)
        .post("/api/documents")
        .attach("pdf", fileBuffer, {
          filename: "test.pdf",
          contentType: "application/pdf",
        })
        .set("Cookie", authCookie2);
      sessionId = data.body.session.id;
      expect(data.status).toBe(201);
    });
    it("throw 403 on Unauthorized session access", async () => {
      const data = await request(app)
        .get(`/api/sessions/${sessionId}`)
        .set("Cookie", authCookie1);

      expect(data.status).toBe(403);
    });
    it("throw 403 on Unauthorized session delete", async () => {
      const data = await request(app)
        .post(`/api/sessions/${sessionId}/delete`)
        .set("Cookie", authCookie1);
      expect(data.status).toBe(403);
    });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { username: "testuser123121" } });
    await prisma.user.delete({ where: { username: "testuser1231212" } });
  });
});
