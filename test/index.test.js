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

})