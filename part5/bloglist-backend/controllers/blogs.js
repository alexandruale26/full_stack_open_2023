const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({ user: request.user.id }).populate("user", { username: 1, name: 1 });
  return response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1 });

  if (blog) response.json(blog);
  else response.status(404).end();
});

blogsRouter.post("/", async (request, response) => {
  const { body } = request;

  const user = await User.findById(request.user.id);

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const userId = request.user.id;
  const blog = await Blog.findById(request.params.id);

  if (blog === null) return response.status(404).send({ error: "invalid id" });

  if (blog.user.toString() !== userId) return response.status(401).send({ error: "invalid user" });

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: request.params.id, user: request.user.id },
    { title, author, url, likes, user },
    { new: true, context: "query" }
  );

  if (updatedBlog) response.json(updatedBlog);
  else response.status(400).send({ error: "error updating" });
});

module.exports = blogsRouter;
