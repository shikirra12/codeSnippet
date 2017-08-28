const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcryt = require('bcryptjs');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
  username: {type: String, unique: true, lowercase: true, required: true},
  passwordHash: {type: String, required: true}
});

// const snippetSchema = new mongooseSchema({
//   title: {type: String, required: true},
//   body: [String],
//   notes: String,
//   language: {type: String, required: true},
//   tags: [String]
// });

const User = mongoose.model("User", userSchema);
// const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = User;
