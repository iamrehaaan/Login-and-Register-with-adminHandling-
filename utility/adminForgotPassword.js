const nodemailer = require("nodemailer");

const { dev } = require("../config");
exports.adminForgotPassword = async (email, name, _id, token) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: dev.app.authEmail, // generated ethereal user
        pass: dev.app.authPassword, // generated ethereal password
      },
    });

    const configureOption = {
      from: dev.app.authEmail, // sender address
      to: email, // list of receivers
      subject: "Forgot Pasword", // Subject line
      html: `<p>Welcome ${name},<a href="http://localhost:3002/admin/reset-password?token=${token}"> Click here to reset your password </a> </p>`, // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(configureOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: %s", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
