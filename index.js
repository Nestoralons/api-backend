// const http = require("http");
const express = require("express");
const app = express();
const logger = require("./middlewares");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(logger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello world<h1>");
});
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const nota = notes.find((nota) => nota.id === id);

  nota ? response.json(nota) : response.status(404).end();
});
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((nota) => nota.id !== id);

  response.status(204).end();
});
app.post("/api/notes", (request, response) => {
  const note = request.body;
  const id = notes.map((note) => note.id);
  const maxid = Math.max(...id);
  const newNote = {
    id: maxid + 1,
    content: note.content,
    important: note.important || false,
    date: new Date().toISOString(),
  };
  notes = { ...notes, ...newNote };
  response.json(newNote);
});
app.use((request, response) => {
  response.status(404).json({
    error: "Not found",
  });
});
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
