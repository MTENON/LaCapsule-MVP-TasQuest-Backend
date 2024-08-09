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
var roomsRouter = require("./routes/rooms");;
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

// function pour verifier la validitée du token
const validateToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ token: req.headers.authorization });
    if (user === null || user === undefined) {
      return res.json({ result: false, error: "Token invalide" });
    }
    req.body._id =  user._id ;
    next();
  } catch (error) {
    console.error(error);
    res.json({ result: false, error: "Internal server error" });
  }
};

// appelle de la function de verification du token par famille de routes
app.use("/habits", validateToken);
// app.use("/tasks", validateToken);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/habits", habitsRouter);
app.use("/classes", classesRouter);
app.use("/rooms", roomsRouter);
// app.use("/tasks", tasksRouter);

module.exports = app;
