const { Schema, model } = require("mongoose");

const registerSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [3, "password must be atleast 3 characters"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: "",
  },
});

exports.Register = model("Registration", registerSchema);
