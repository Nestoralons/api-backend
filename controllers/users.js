const usersRouter = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    date: 1,
  });
  response.json(users);
});
usersRouter.post("/", async (request, response) => {
  try {
    const { body } = request;
    const { username, name, password } = body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      name: name,
      passwordHash: passwordHash,
    });
    const savedUser = await user.save();
    //console.log(savedUser);
    response.json(savedUser);
  } catch (error) {
    response.status(400).json({ message: "Este usuario ya existe" });
  }
});
module.exports = usersRouter;
