const { json, urlencoded } = require("express");
const { dev } = require("../config");
var session = require("express-session");
const express = require("express");
const {
  renderLoginPage,
  getLoginData,
  loggedHome,
  logoutUser,
  renderVerifyAgain,
  verifyAgain,
  renderForgotPassword,
  sendEmailForgotPassword,
  renderResetPassword,
  resetPassword,
  renderEditView,
  editProfile,
} = require("../controllers/login.controller");

const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");

const loginRoutes = express();

loginRoutes.use(
  session({
    secret: dev.app.secret_key,
    resave: false,
    saveUninitialized: true,
  })
);

loginRoutes.use(json());
loginRoutes.use(urlencoded({ extended: true }));

loginRoutes.get("/login", isLoggedOut, renderLoginPage);
loginRoutes.get("/loggedHome", isLoggedIn, loggedHome);
loginRoutes.post("/login", getLoginData);
loginRoutes.get("/logout", isLoggedIn, logoutUser);

loginRoutes.get("/verifyAgain", isLoggedOut, renderVerifyAgain);
loginRoutes.post("/verifyAgain", verifyAgain);

loginRoutes.get("/forgot-password", renderForgotPassword);
loginRoutes.post("/forgot-password", sendEmailForgotPassword);

loginRoutes.get("/reset-password", renderResetPassword);
loginRoutes.post("/reset-password", resetPassword);

loginRoutes.get("/editProfile", isLoggedIn, renderEditView);
loginRoutes.post("/editProfile", isLoggedIn, editProfile);

module.exports = loginRoutes;
