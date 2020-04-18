const mongoose = require('mongoose')
const Schema = mongoose.Schema

const autoShema = new Schema({
  name: String,
  model: String,
  body: String,
  engine: String,
})

module.exports = mongoose.model('auto', autoShema)
