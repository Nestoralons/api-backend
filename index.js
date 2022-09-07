require("dotenv").config();
require("./mongo.js");

// const http = require("http");

const express = require("express");
const app = express();
const logger = require("./middlewares");
const cors = require("cors");
const Note = require("./models/model");
const notFound = require("./middleware/notFound.js");
const handleErrors = require("./middleware/handleErrors.js");
const usersRouter = require("./controllers/users");
const User = require("./models/Users");
const loginRouter = require("./controllers/login");
const jwt = require("jsonwebtoken");
const userExtractor = require("./middleware/userExtractor");
app.use(cors());
app.use(express.json());
app.use(logger);

//let notes = [];
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello world<h1>");
});
app.get("/api/notes", async (request, response) => {
  // response.json(notes);
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(notes);
  // Note.find({}).then((result) => {
  //   response.json(result);
  // });
});

app.get("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  // const nota = notes.find((nota) => nota.id === id);

  // nota ? response.json(nota) : response.status(404).end();
  Note.findById(id)
    .then((nota) => {
      nota ? response.json(nota) : response.status(404).end();
    })
    .catch((err) => {
      next(err);
      // console.log(err.message);
      // response.status(400).end();
    });
});

app.put("/api/notes/:id", userExtractor, (request, response, next) => {
  const { id } = request.params;
  const note = request.body;
  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});
app.delete("/api/notes/:id", userExtractor, (request, response, next) => {
  const id = request.params.id;
  // notes = notes.filter((nota) => nota.id !== id);
  Note.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});
app.post("/api/notes", userExtractor, async (request, response, next) => {
  const { content, important } = request.body;
  // const authorization = request.get("authorization");
  // let token = null;
  // if (authorization && authorization.toLowerCase().startsWith("bearer")) {
  //   token = authorization.substring(7);
  // }

  // const decodedToken = jwt.verify(token, process.env.SECRET);

  // if (!token || !decodedToken.id) {
  //   return response.status(401).json({ error: "token missing o invalid" });
  // }
  // const { id: userId } = decodedToken;
  const { userId } = request;
  const user = await User.findById(userId);
  const newNote = new Note({
    content: content,
    important: important || false,
    date: new Date().toISOString(),
    user: user._id,
  });

  try {
    const savedNote = await newNote.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    response.json(savedNote);
  } catch (error) {
    next(error);
  }

  // newNote.save().then((result) => {

  //   response.json(result);
  // });
});
// app.use((request, response) => {
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(notFound);

app.use(handleErrors);
const PORT = process.env.PORT;
console.log(PORT);
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = { app, server };
