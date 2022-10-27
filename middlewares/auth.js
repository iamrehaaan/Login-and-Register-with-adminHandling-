const isLoggedIn = async (req, res, next) => {
  try {
    if (req.session.userId) {
    } else {
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    if (req.session.userId) {
      return res.redirect("/loggedHome");
    } else {
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut };
