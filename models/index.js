//const mongoose = require("mongoose");
const User = require("./schemas/user");
const News = require("./schemas/news");

module.exports.getUserByName = async (userName) => {
  return User.findOne({ userName });
};
module.exports.getUserById = async (id) => {
  return User.findById({ _id: id });
};
module.exports.getUsers = async () => {
  return User.find();
};
module.exports.createUser = async (data) => {
  const { username, surName, firstName, middleName, password } = data;
  const newUser = new User({
    userName: username,
    surName,
    firstName,
    middleName,
    image:
      "https://icons-for-free.com/iconfiles/png/512/profile+user+icon-1320166082804563970.png",
    permission: {
      chat: { C: true, R: true, U: true, D: true },
      news: { C: true, R: true, U: true, D: true },
      settings: { C: true, R: true, U: true, D: true },
    },
  });
  newUser.setPassword(password);
  const user = await newUser.save();
  //console.log(user)
  return user;
};
module.exports.updateUser = (id, data) => {
  return User.findByIdAndUpdate({ _id: id }, data);
};
module.exports.deleteUser = (id) => {
  return User.findByIdAndDelete({ _id: id });
};

module.exports.getNews = async () => {
  return News.find();
};
module.exports.createNews = async (data, user) => {
  // const {title, text} = data
  //const dateCreated = Date(Date.now())
  const dateCreated = new Date()
  console.log(dateCreated)

  const newPost = new News({
    created_at: dateCreated,
    title: data.title,
    text: data.text,
    user: {
      firstName: user.firstName,
      id: user._id,
      image: user.image,
      middleName: user.middleName,
      surName: user.surName,
      username: user.userName
  }
  });

  const post = await newPost.save()
  //console.log(newPost)
  return post
};
module.exports.updateNews = async (id, data) => {
  return News.findByIdAndUpdate({ _id: id }, data);
};
module.exports.deleteNews = async (id) => {
  return User.findByIdAndDelete({ _id: id });
};
