const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let headers = undefined;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  const newUser = {
    username: "root",
    name: "Root",
    password: "sekret",
  };

  await api.post("/api/users").send(newUser);
  const result = await api.post("/api/login").send(newUser);

  headers = { Authorization: `Bearer ${result.body.token}` };
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .set(headers)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs").set(headers);

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
      .set(headers)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).set(headers).expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).set(headers).expect(400);
  });
});

describe("adding a new blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Cats are ultra cute",
      author: "Maya",
      url: "https://catzzz.com/",
      likes: 700,
    };

    await api
      .post("/api/blogs")
      .set(headers)
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

    await api.post("/api/blogs").set(headers).send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with the proper status code 401 Unauthorized if a token is not provided", async () => {
    const newBlog = {
      title: "Cats are ultra cute",
      author: "Maya",
      url: "https://catzzz.com/",
      likes: 700,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("testing blog object", () => {
  test("if the likes property is missing, will default to zero", async () => {
    const newBlog = {
      title: "Dogs are the best",
      author: "James",
      url: "https://angrydogzzz.com/",
    };

    await api
      .post("/api/blogs")
      .set(headers)
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

    await api.post("/api/blogs").set(headers).send(newBlog).expect(400);
  });

  test("if the url property is missing, will receive status code 400", async () => {
    const newBlog = {
      title: "Dogzz",
      author: "James",
      likes: 100,
    };

    await api.post("/api/blogs").set(headers).send(newBlog).expect(400);
  });
});

describe("deleting a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const newBlog = {
      title: "Cats are ultra cute",
      author: "Maya",
      url: "https://catzzz.com/",
      likes: 700,
    };

    const blogToDelete = await api.post("/api/blogs").set(headers).send(newBlog);
    const blogsAfterSave = await api.get("/api/blogs").set(headers);

    await api.delete(`/api/blogs/${blogToDelete.body.id}`).set(headers).expect(204);

    const blogsAtEnd = await api.get("/api/blogs").set(headers);
    expect(blogsAtEnd.body).toHaveLength(blogsAfterSave.body.length - 1);

    const contents = blogsAtEnd.body.map((blog) => blog.url);
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
      .set(headers)
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

    await api.put(`/api/blogs/${blogToUpdate.id}`).set(headers).send(blogData).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
