const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

const api = supertest(app);

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

test("returned blogs have the id property", async () => {
  const blogsInDb = await helper.blogsInDb();

  expect(blogsInDb[0].id).toBeDefined();
});

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

afterAll(async () => {
  await mongoose.connection.close();
});
