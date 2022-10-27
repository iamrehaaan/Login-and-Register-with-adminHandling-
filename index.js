const express = require("express");
const { dev } = require("./config");
const { connectDB } = require("./config/db");
const registerRoutes = require("./routers/register.routes");
const loginRoutes = require("./routers/login.routes");
const adminRoutes = require("./routers/admin.routes");

const app = express();

const port = dev.app.port;
app.set("view engine", "ejs");

app.listen(port, async () => {
  console.log(`The server is running at http://localhost:${port}`);
  await connectDB();
});

app.use(registerRoutes);
app.use(loginRoutes);
app.use("/admin", adminRoutes);

// app.use(loginRoutes);

app.get("/", (req, res) => {
  res.send({ message: "Welcome to home" });
});
