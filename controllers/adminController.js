const { Register } = require("../models/dbSchema");
const {
  comparePassword,
  hashedPassword,
} = require("../securePassword/hashedPassword");
const { adminForgotPassword } = require("../utility/adminForgotPassword");
const { forgotPasswordString } = require("../utility/tokenforPasswordReset");

const renderAdminLogin = (req, res) => {
  try {
    res.status(200).render("adminLogin");
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminData = await Register.findOne({ email: email });
    if (adminData) {
      const isMatched = await comparePassword(password, adminData.password);
      if (isMatched) {
        if (adminData.isAdmin) {
          req.session.adminId = adminData._id;
          res.redirect("/admin/adminHome");
        } else {
          res.status(404).send("You are not Admin");
        }
      } else {
        res.status(404).send("username and password incorrect");
      }
    } else {
      res.status(404).send("username and password incorrect");
    }
    res.status(200).send();
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const renderAdminHome = async (req, res) => {
  try {
    const admin = await Register.findOne({ _id: req.session.adminId });
    res.status(200).render("adminHome", { admin: admin });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const adminLogout = (req, res) => {
  try {
    req.session.destroy();
    res.status(200).redirect("/admin/login");
    res.status(200).render("adminHome");
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const renderAdminDashboard = async (req, res) => {
  try {
    let search = req.query.search ? req.query.search : "";

    const { page = 1, limit = 2 } = req.query;

    const userCount = await Register.find({
      isAdmin: false,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    }).countDocuments();

    const users = await Register.find({
      isAdmin: false,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).render("adminDashboard", {
      users: users,
      totalPages: Math.ceil(userCount / limit),
      currentPage: page,
      prevPage: page - 1,
      nextPage: Number(page) + 1,
    });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    const user = await Register.findByIdAndDelete({ _id: req.query.id });
    if (user) {
      res.redirect("/admin/dashboard");
    } else {
      res.send({ message: "user not deleted" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const renderForgotPassword = (req, res) => {
  try {
    res.status(200).render("adminForgotPassword");
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const adminForgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await Register.findOne({ email: email });
    if (userData) {
      if (userData.isAdmin) {
        const randomString = forgotPasswordString();
        await Register.updateOne(
          { email: email },
          {
            $set: {
              token: randomString,
            },
          }
        );
        adminForgotPassword(
          userData.email,
          userData.name,
          userData._id,
          randomString
        );
        res.send({ message: "Email Send, check email" });
      } else {
        res.send({ message: "You are not admin" });
      }
    } else {
      res.send({ message: "User doesnot exist with this email" });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
};

const renderResetFromEmail = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await Register.findOne({ token: token });
    if (tokenData) {
      res.status(200).render("adminResetfromEmail", { adminId: tokenData._id });
    } else {
      res.send({ message: "user doesnot exist" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const resetFromEmail = async (req, res) => {
  try {
    const password = req.body.password;
    const securePassword = await hashedPassword(password);
    const adminId = req.body.adminId;

    await Register.findByIdAndUpdate(
      { _id: adminId },
      {
        $set: {
          password: securePassword,
          token: "",
        },
      }
    );
    res.redirect("/admin/login");
  } catch (error) {
    res.send(error.message);
  }
};

const renderEditUser = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await Register.findOne({ _id: id });
    if (user) {
      res.render("editUser", { user: user });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await Register.findOneAndUpdate(
      { _id: req.query.id },
      {
        $set: {
          name,
          email,
        },
      }
    );
    if (user) {
      res.redirect("/admin/dashboard");
    } else {
      res.status(404).send({ message: "update was not successful" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

module.exports = {
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
};
