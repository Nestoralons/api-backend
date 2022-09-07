const { model, Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new Schema({
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  },
});
userSchema.plugin(uniqueValidator);
const User = model("User", userSchema);
module.exports = User;
