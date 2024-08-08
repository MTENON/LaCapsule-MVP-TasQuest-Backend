require("dotenv").config();

require("./models/connection"); //Import mongoose connection

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var habitsRouter = require("./routes/habits");
var tasksRouter = require("./routes/tasks");
var classesRouter = require("./routes/classes");
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
        if (!user) {
            res.json({ result: false, error: "Token invalide" });
            return;
        }
    });
    next();
});

app.use("/tasks", (req, res, next) => {
    // const token = req.body.token;
    User.findOne({ token: req.body.token }).then((user) => {
        if (!user) {
            res.json({ result: false, error: "Token invalide" });
            return;
        }
    });
    next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/habits", habitsRouter);
app.use("/tasks", tasksRouter);
app.use("/classes", classesRouter);
// app.use("/tasks", tasksRouter);

module.exports = app;
