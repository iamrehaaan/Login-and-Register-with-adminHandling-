const { json, urlencoded } = require("express");
const { dev } = require("../config");
var session = require("express-session");
const express = require("express");

const { isLoggedIn, isLoggedOut } = require("../middlewares/adminAuth");
const {
  renderAdminLogin,
  adminLogin,
  renderAdminHome,
  adminLogout,
  renderAdminDashboard,
  adminDeleteUser,
  renderForgotPassword,

  adminForgotPasswordEmail,
  renderResetFromEmail,
  resetFromEmail,
  renderEditUser,
  editUser,
} = require("../controllers/adminController");

const adminRoutes = express();

adminRoutes.use(
  session({
    secret: dev.app.secret_key,
    resave: false,
    saveUninitialized: true,
  })
);

adminRoutes.set("views", "./views/admin");

adminRoutes.use(json());
adminRoutes.use(urlencoded({ extended: true }));

adminRoutes.get("/login", isLoggedOut, renderAdminLogin);
adminRoutes.post("/login", adminLogin);

adminRoutes.get("/adminHome", isLoggedIn, renderAdminHome);
adminRoutes.get("/logout", isLoggedIn, adminLogout);

adminRoutes.get("/dashboard", isLoggedIn, renderAdminDashboard);
adminRoutes.get("/delete-user", isLoggedIn, adminDeleteUser);

adminRoutes.get("/forgot-password", isLoggedOut, renderForgotPassword);
adminRoutes.post("/forgot-password", adminForgotPasswordEmail);

adminRoutes.get("/reset-password", isLoggedOut, renderResetFromEmail);
adminRoutes.post("/reset-password", resetFromEmail);

adminRoutes.get("/edit-user", isLoggedIn, renderEditUser);
adminRoutes.post("/edit-user", isLoggedIn, editUser);

module.exports = adminRoutes;
