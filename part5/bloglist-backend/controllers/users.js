const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const exceptions = require("../utils/exceptions");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { url: 1, title: 1, author: 1 });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  const passwordMinLength = 3;

  if (password === undefined || password.length < passwordMinLength)
    throw new exceptions.PasswordValidation(password, passwordMinLength);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({ username, name, passwordHash });

  const savedUser = await newUser.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
