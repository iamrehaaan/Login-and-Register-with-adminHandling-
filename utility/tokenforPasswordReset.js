var randomstring = require("randomstring");
exports.forgotPasswordString = () => {
  return randomstring.generate();
};
