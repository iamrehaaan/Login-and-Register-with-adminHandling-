const e = require("express");
const { Register } = require("../models/dbSchema");
const {
  comparePassword,
  hashedPassword,
} = require("../securePassword/hashedPassword");
const { emailVerification } = require("../utility/emailVerification");
const {
  forgotPasswordVerification,
} = require("../utility/forgotPasswordVerification");
const { forgotPasswordString } = require("../utility/tokenforPasswordReset");

const renderLoginPage = (req, res) => {
  res.render("login");
};

const getLoginData = async (req, res) => {
  const { email, password } = req.body;
  const userData = await Register.findOne({ email: email });
  if (userData) {
    const isMatched = await comparePassword(password, userData.password);
    if (isMatched) {
      if (userData.isVerify) {
        req.session.userId = userData._id;
        res.redirect("/loggedHome");
      } else {
        res.status(404).send("Please verify your email");
      }
    } else {
      res.status(404).send("username and password incorrect");
    }
  } else {
    res.status(404).send("username and password incorrect");
  }
  res.status(200).send();
};

const loggedHome = async (req, res) => {
  try {
    const user = await Register.findOne({ _id: req.session.userId });

    res.render("loggedHome", { user: user });
  } catch (error) {
    res.send({ message: error });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy();
  res.status(200).redirect("/login");
};

const renderVerifyAgain = (req, res) => {
  res.render("verifyAgain");
};

const verifyAgain = async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await Register.findOne({ email: email });

    if (findUser) {
      emailVerification(findUser.email, findUser.name, findUser._id);
      res.send({ message: "Email send, check your email" });
    } else {
      res.send({ message: "user not found" });
    }
  } catch (error) {
    res.send({ message: error });
  }
};

const renderForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

const sendEmailForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await Register.findOne({ email: email });
    if (userData) {
      if (userData.isVerify) {
        const randomString = forgotPasswordString();
        await Register.updateOne(
          { email: email },
          {
            $set: {
              token: randomString,
            },
          }
        );
        forgotPasswordVerification(
          userData.email,
          userData.name,
          userData._id,
          randomString
        );
        res.send({ message: "Email Send, check email" });
      } else {
        res.send({ message: "Please verify your email first" });
      }
    } else {
      res.send({ message: "User doesnot exist with this email" });
    }
  } catch (error) {
    res.send({ message: error });
  }
};

const renderResetPassword = async (req, res) => {
  const token = req.query.token;
  const tokenData = await Register.findOne({ token: token });
  if (tokenData) {
    res.render("reset-password", { userId: tokenData._id });
  } else {
    res.send({ message: "user doesnot exist" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const securePassword = await hashedPassword(password);
    const userId = req.body.userId;

    await Register.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          password: securePassword,
          token: "",
        },
      }
    );
    res.redirect("/login");
  } catch (error) {
    res.send(error);
  }
};

const renderEditView = async (req, res) => {
  const id = req.query.id;
  const user = await Register.findById({ _id: id });

  if (user) {
    res.render("editProfile", { user: user });
  } else {
    res.send("user not found");
  }
};

const editProfile = async (req, res) => {
  try {
    const id = req.query.id;
    const { name, email } = req.body;

    const user = await Register.findById({ _id: id });
    if (user) {
      if (req.body.email !== user.email) {
        await Register.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: name,
              email: email,
              isVerify: false,
            },
          }
        );
        req.session.destroy();
        res.redirect("/login");
      } else {
        await Register.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: name,
            },
          }
        );
        res.redirect("/LoggedHome");
      }
    } else {
      res.send("User not found");
    }
  } catch (error) {
    res.send({ message: error });
  }
};
module.exports = {
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
};
