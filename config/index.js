require("dotenv").config();

exports.dev = {
  app: {
    port: process.env.PORT || 3002,
    secret_key: process.env.SECRECT_STRING || "",
    authPassword: process.env.VERIFY_PASSWORD,
    authEmail: process.env.EMAIL,
  },
  url: {
    DB_URL: process.env.URL_LINK,
  },
};
