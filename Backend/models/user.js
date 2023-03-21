const mongoose = require("mongoose");
const mongooseValidor = require("mongoose-unique-validator");

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, requried: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId , required: true, ref:"Place" }]
});

userSchema.plugin(mongooseValidor);

module.exports = mongoose.model("User", userSchema);
