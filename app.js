require("dotenv").config();

require("./models/connection"); //Import mongoose connection

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var habitsRouter = require("./routes/habits");
var classesRouter = require("./routes/classes");
var questsRouter = require("./routes/quests")
// var tasksRouter = require("./routes/tasks");

var app = express();

const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// MIDDLEWARES TOKEN VALIDITY =>

const User = require("./models/users");
app.use("/habits", (req, res, next) => {
  // const token = req.body.token;
  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.status(401); nb
      res.json({ result: false, error: "Token invalide" });
      return;
    }
    req.body = { ...req.body, _id: user._id };
    next();
  });
});

app.use("/tasks", (req, res, next) => {
  // const token = req.body.token;
  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "Token invalide" });
      return;
    }
    req.body = { ...req.body, _id: user._id };
    next();
  });
});

app.use("/quests", (req, res, next) => {

  User.findOne({ token: req.headers.authorization }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "Token invalide" });
      return;
    }
    req.body = { ...req.body, _id: user._id };
    next();
  });

});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/habits", habitsRouter);
app.use("/classes", classesRouter);
app.use("/quests", questsRouter);
// app.use("/tasks", tasksRouter);

module.exports = app;
