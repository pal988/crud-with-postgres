const request = require("supertest");
const app = require("../index.js");
const { Client } = require("pg");
//require('dotenv').config();

const conn = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "LoginDB",
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
        name: "Random",
        email: "random@y.com",
        password: "random@1",
      })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Random");
    expect(res.body.email).toBe("random@y.com");
    expect(res.body.password).toBe("random@1");
    userName = res.body.name;
  });

  test("To fetch user data by id", async () => {
    const res = await request(app)
      .get(`/getUserDataByName/${userName}`)
      .expect(200);
    expect(res.body).toHaveProperty("name", userName);
    expect(res.body.email).toBe("random@y.com");
    expect(res.body.password).toBe("random@1");
  });
});
