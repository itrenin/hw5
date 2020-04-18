const mongoose = require("mongoose");
//const User = require("./user");
const Schema = mongoose.Schema;
const newsSchema = new Schema({
  created_at: {
    type: Date,
  },
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  user: {
    firstName: String,
    id: String,
    image: String,
    middleName: String,
    surName: String,
    username: String,
  },
});
const News = mongoose.model("news", newsSchema);

module.exports = News;
