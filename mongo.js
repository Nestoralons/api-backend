const mongoose = require("mongoose");
const { MONGO_DB_URI_TEST, MONGO_DB_URI, NODE_ENV } = process.env;
const connectionString = NODE_ENV === "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;
//console.log(connectionString);
//conexion a mongodb
const opciones = {
  autoIndex: true,
};

mongoose
  .connect(connectionString, {
    autoIndex: true,
  })
  .then(() => {
    console.log("DB CONECTADA");
  })
  .catch((err) => {
    console.log(err);
  });
process.on("uncaughtException", () => {
  mongoose.disconnect();
});
// const noteSchema = new Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// });

// const Note = model("Note", noteSchema);
// Note.find({}).then((result) => {
//   console.log(result);
// });
// const note = new Note({
//   content: "MongoDb es cool",
//   date: new Date(),
//   important: true,
// });
// note
//   .save()
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.log(err);
//   });
