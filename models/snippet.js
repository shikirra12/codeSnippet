const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcryt = require('bcryptjs');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/codesnippet');

const snippetSchema = new mongoose.Schema({
  username: {type: String, required: true, lowercase: true},
  title: {type: String, required: true},
  body: [String],
  notes: String,
  language: {type: String, required: true},
  tags: [String]
});

const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = Snippet;
