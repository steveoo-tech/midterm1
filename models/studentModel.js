const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentModel = new Schema({
  date: { type: String },
  courseNumber: { type: String },
  time: { type: String },
  location: { type: String },
});

module.exports = mongoose.model("Student", studentModel);
