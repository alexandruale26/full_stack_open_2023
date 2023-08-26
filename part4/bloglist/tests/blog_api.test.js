const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("add a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", name: "Root", passwordHash });

    await user.save();
  });

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

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe("viewing a specific blog", () => {
  test("a returned blog has the id property", async () => {
    const blogsInDb = await helper.blogsInDb();

    expect(blogsInDb[0].id).toBeDefined();
  });

  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("adding a new blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Cats",
      author: "Maya",
      url: "https://catzzz.com/",
      likes: 700,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((b) => b.url);
    expect(contents).toContain("https://catzzz.com/");
  });

  test("fails with status code 400 if data invalid", async () => {
    const newBlog = { url: "fakeURL" };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("testing blog object", () => {
  test("if the likes property is missing, will default to zero", async () => {
    const newBlog = {
      title: "Dogs",
      author: "James",
      url: "https://angrydogzzz.com/",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const zeroLikesBlog = blogsAtEnd.find((b) => b.url === "https://angrydogzzz.com/");

    expect(zeroLikesBlog.likes).toBe(0);
  });

  test("if the title property is missing, will receive status code 400", async () => {
    const newBlog = {
      author: "James",
      url: "https://angrydogzzz.com/",
      likes: 100,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("if the url property is missing, will receive status code 400", async () => {
    const newBlog = {
      title: "Dogzz",
      author: "James",
      likes: 100,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("deleting a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((blog) => blog.url);
    expect(contents).not.toContain(blogToDelete.url);
  });
});

describe("updating a blog", () => {
  test("with a valid id is successfull", async () => {
    const blogData = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 999,
    };

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((blog) => blog.likes);
    expect(contents).toContain(999);
  });

  test("with invalid data will return status code 400", async () => {
    const blogData = {
      title: "Below 10",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 100,
    };

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogData).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
