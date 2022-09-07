const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const { SECRET } = process.env;
const User = require("../models/Users");

loginRouter.post("/", async (request, response) => {
  const { body } = request;
  const { username, password } = body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(passwordCorrect && user)) {
    response.status(401).json({
      error: "Invalid user or password",
    });
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  };
  const token = jwt.sign(userForToken, SECRET, { expiresIn: "30d" });
  response.send({
    name: user.name,
    username: user.username,
    token,
  });
});
module.exports = loginRouter;
