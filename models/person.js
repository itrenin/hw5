const mongoose = require('mongoose')
const Schema = mongoose.Schema

const personScheme = new Schema({
  name: String,
  age: Number,
})

module.exports = mongoose.model('person', personScheme)