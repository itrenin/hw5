const express = require("express");
const router = express.Router();
//const mock = require("./mock.json");
const tokens = require("../auth/tokens");
const secret = require("../auth/config.json");
const passport = require("passport");
const db = require("../models");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) {
      //console.log(info.message)
      res.status(401).json({
        statusMessage: "Error",
        data: { status: 401, message: "Unauthorized" },
      });
    } else {
      next();
    }
  })(req, res, next);
};

router.post("/registration", async (req, res) => {
  //console.log(req.body)
  const { username } = req.body;
  const user = await db.getUserByName(username);
  if (user) {
    return res.status(400).json({});
  }
  try {
    const newUser = await db.createUser(req.body);
    const token = await tokens.createTokens(newUser, secret.secret);
    res.json({
      firstName: newUser.firstName,
      id: newUser._id,
      image: newUser.image,
      middleName: newUser.middleName,
      permission: newUser.permission,
      surName: newUser.surName,
      username: newUser.userName,
      ...token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

router.post("/login", async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({});
      }
      if (user) {
        const token = await tokens.createTokens(user, secret.secret);
        //console.log(token)
        res.json({
          firstName: user.firstName,
          id: user._id,
          image: user.image,
          middleName: user.middleName,
          permission: user.permission,
          surName: user.surName,
          username: user.userName,
          ...token,
        });
      }
    }
  )(req, res, next);
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.headers["authorization"];
  const data = await tokens.refreshTokens(refreshToken, db, secret.secret);
  res.json(data);
});

router.get("/profile", auth, async (req, res) => {
  const token = req.headers["authorization"];
  let userId = -1;
  try {
    userId = jwt.verify(token, secret.secret).user.id;
  } catch (err) {
    return {};
  }
  const user = await db.getUserById(userId);
  res.json({
    firstName: user.firstName,
    id: user._id,
    image: user.image,
    middleName: user.middleName,
    permission: user.permission,
    surName: user.surName,
    username: user.userName,
  });
});

router
  .get("/users", auth, async (req, res) => {
    const users = await db.getUsers();
    // TODO: refactor
    res.json(
      users.map((element) => {
        const el = { ...element._doc };
        delete el.hash;
        delete el.__v;
        el.id = el._id;
        delete el._id;
        el.username = el.userName;
        delete el.userName;
        console.log(el);
        return el;
      })
    );
  })
  .patch("/users/:id/permission", auth, async (req, res) => {
    await db.updateUser(req.params.id, req.body);
  })
  .delete("/users/:id", auth, async (req, res) => {
    await db.deleteUser(req.params.id);
  });

router
  .get("/news", auth, async (req, res) => {
    // console.log('NEWS:')
    //console.log(req.headers.authorization)
    const news = await db.getNews();
    //console.log(news);
    // res.json(mock.news);
    res.json(
      news.map((element) => {
        const el = { ...element._doc };
        delete el.__v;
        el.id = el._id;
        delete el._id;
        //console.log(el);
        return el;
      })
    );
   })
  .post("/news", auth, async (req, res) => {
    //console.log(req.body)
    const token = req.headers["authorization"];
    let userId = -1;

    try {
      userId = jwt.verify(token, secret.secret).user.id;
    } catch (err) {
      console.log(err);
      return {};
    }
    const user = await db.getUserById(userId);

    //console.log(user);
    await db.createNews(req.body, user);
    //res.json(mock.news)
  })
  .patch("/news/:id", auth, async (req, res) => {
    //console.log(req.body)

    //res.json(mock.news);
    await db.updateNews(req.params.id, req.body)
    const news = await db.getNews();
    res.json(
      news.map((element) => {
        const el = { ...element._doc };
        delete el.__v;
        el.id = el._id;
        delete el._id;
        console.log(el);
        return el;
      })
    );
  })
  .delete("/news/:id", auth, async (req, res) => {
    //console.log(req.body)
    await db.deleteNews(req.params.id)
    //res.json(mock.news);
    const news = await db.getNews();
    res.json(
      news.map((element) => {
        const el = { ...element._doc };
        delete el.__v;
        el.id = el._id;
        delete el._id;
        console.log(el);
        return el;
      })
    );
  });

module.exports = router;
