const { Register } = require("../models/dbSchema");
const { hashedPassword } = require("../securePassword/hashedPassword");
const { emailVerification } = require("../utility/emailVerification");

const renderHomePage = (req, res) => {
  res.render("home");
};

const renderRegisterPage = (req, res) => {
  res.render("register");
};

const addUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    console.log(password);
    const userPassword = req.body.password;
    const hashPassword = await hashedPassword(userPassword);
    console.log(hashPassword);
    const newUser = new Register({
      name,
      email,
      password: hashPassword,
      isAdmin: false,
    });

    const userData = await newUser.save();
    if (userData) {
      emailVerification(userData.email, userData.name, userData._id);
      res.status(200).send("Data added, please verify your email to login");
    } else {
      res.status(404).send({ message: "Route Error" });
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const verifyUser = async (req, res) => {
  try {
    const id = req.query.id;
    console.log("the id is " + id);
    const userUpdated = await Register.updateOne(
      { _id: id },
      {
        $set: {
          isVerify: true,
        },
      }
    );

    if (userUpdated) {
      res.render("verification");
    } else {
      res.render("verification");
    }
  } catch (error) {
    res.status(404).send({ message: "Route Errors" });
  }
};
module.exports = { renderHomePage, renderRegisterPage, addUser, verifyUser };
