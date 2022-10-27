const { json, urlencoded } = require("express");
const express = require("express");
var session = require("express-session");
const { dev } = require("../config");
const {
  renderHomePage,
  renderRegisterPage,
  addUser,
  verifyUser,
} = require("../controllers/registerController");
const { isLoggedOut } = require("../middlewares/auth");
const registerRoutes = express();

registerRoutes.use(
  session({
    secret: dev.app.secret_key,
    resave: false,
    saveUninitialized: true,
  })
);

registerRoutes.use(json());
registerRoutes.use(urlencoded({ extended: true }));

registerRoutes.get("/home", renderHomePage);
registerRoutes.get("/register", isLoggedOut, renderRegisterPage);

registerRoutes.post("/register", addUser);

registerRoutes.get("/verify", isLoggedOut, verifyUser);

module.exports = registerRoutes;
