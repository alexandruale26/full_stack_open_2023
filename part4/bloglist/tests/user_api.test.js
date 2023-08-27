const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secretPass", 10);
  const user = new User({ username: "root", name: "Root", passwordHash });

  await user.save();
});

describe("add a new user", () => {
  test("is successfully created if password and username are valid", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "test-user",
      name: "Test Testing",
      password: "myPassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const users = usersAtEnd.map((user) => user.username);
    expect(users).toContain("test-user");
  });

  test("creation fails with proper status code and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Root",
      password: "sekret",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper status code and message if username is shorter than minimum requirement", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ga",
      name: "Markus",
      password: "sekret",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain("is shorter than the minimum allowed length");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper status code and message if username is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Markus",
      password: "sekret",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain("`username` is required");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper status code and message if password is shorter than minimum requirement", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "gamer100",
      name: "Markus",
      password: "al",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain("is shorter than the minimum allowed length");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper status code and message if password is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "gamer100",
      name: "Markus",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain("Password validation failed: `password` is required");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe("when user logs in", () => {
  test("is successfull with correct credentials", async () => {
    const user = { username: "root", password: "secretPass" };

    const response = await api
      .post("/api/login")
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.token).toBeDefined();

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(decodedToken.username).toBe(response.body.username);
  });

  test("will fail if username is invalid and responds with proper status code", async () => {
    const user = { username: "noRoot", password: "secretPass" };

    const response = await api.post("/api/login").send(user).expect(401);

    expect(response.body.error).toBe("invalid username or password");
  });

  test("will fail if password is invalid and responds with proper status code", async () => {
    const user = { username: "root", password: "wrongPass" };

    const response = await api.post("/api/login").send(user).expect(401);

    expect(response.body.error).toBe("invalid username or password");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
