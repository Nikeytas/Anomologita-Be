"use strict";
const path = require("path");
require("dotenv").config({
  path: !!process.env.NODE_ENV
    ? __dirname + `/.env.${process.env.NODE_ENV}`
    : __dirname + "/.env.development",
});
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const DB = require("./database/DB");
const cors = require("cors");
const logger = require("./logger/winstonLogger").logger;
const loggingPolicy = require("./logger/loggingPolicy").loggingPolicy;

const passport = require("passport");

const { handleDefaultError } = require("./middlewares/errorHandling");

//Define express apps
const app = express();

const emulateFlash = function (req, res, next) {
  req.flash = (type, message) => {
    logger.error(message);
    return res.status(403).send({ status: "fail", message });
  };
  next();
};

//Middleware
app.use(cors()); // allows our React application to make HTTP requests to Express application
app.use(express.json()); // the new Express implementation of body-parser middleware
app.use(cookieParser());
app.use(emulateFlash);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("templates/assets"));
app.use("/static", express.static(path.join(__dirname, "templates", "assets")));

app.use(passport.initialize());

//Connect to Database
DB.connect().catch(async (err) => {
  logger.error(
    `Code: ${loggingPolicy.failDatabaseConnection.code}, ${loggingPolicy.failDatabaseConnection.message}, ${err}`
  );
  DB.retry();
});

// Routes should be specified on   ./routes/  dir
// and autoloaded here
console.log("..API Loading");
require("fs")
  .readdirSync(path.join(__dirname, "routes"))
  .forEach((file) => {
    let r = require(path.join(__dirname, "routes", file));
    app.use(r.routeName, r.router);
  });
console.log("◉ API Loaded");

// Using this for displaying status of the API (not in the routes directory)
app.get("/status", (request, response) => {
  const status = {
    Status: "Running env: " + process.env.NODE_ENV,
  };
  response.send(status);
});

app.use(handleDefaultError);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  return res.status(err.status || 500).send({ message: res.locals.message });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).send({ message: "Not found" });
});

module.exports = app;
