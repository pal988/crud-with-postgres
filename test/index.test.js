const request = require("supertest");
const app = require("../index.js");
const { Client } = require("pg");
//require('dotenv').config();

const conn = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "apiDB",
});

beforeAll(async () => {
  await conn.connect();
  await conn.query(`DELETE FROM users`);
});

afterAll(async () => {
  await conn.end();
});

describe("APIs Testing", () => {
  let userName;
  test("To create a valid User", async () => {
    const res = await request(app)
      .post("/createUser")
      .send({
        name: "Vamshi",
        email: "vamshi@y.com",
        password: "vamshi@1",
      })
      .expect(201);

    expect(res.body).toHaveProperty("id1");
    expect(res.body.name).toBe("Vamshi");
    expect(res.body.email).toBe("vamshi@y.com");
    expect(res.body.password).toBe("vamshi@1");
    userName = res.body.name;
  });

  test("To fetch user data by name", async () => {
    const res = await request(app)
      .get(`/getUserDataByName/${userName}`)
      .expect(200);
    expect(res.body).toHaveProperty("name", userName);
    expect(res.body.email).toBe("vamshi@y.com");
    expect(res.body.password).toBe("vamshi@1");
  });

  test("To Delete user data by name", async () => {
    const res = await request(app).delete(`/deleteUser/sanjay`).expect(200);
    await request(app).get(`/getUserDataByName/sanjay`).expect(404);
  });

  test("To update user data by id", async () => {
    let userId = 5;
    const res = await request(app)
      .put(`/updateUser/${userId}`)
      .send({
        name: "John",

        password: "newpas",
      })
      .expect(200);
  });
});
