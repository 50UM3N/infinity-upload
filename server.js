if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
const cookie = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");

// custom modules
const user = require("./models/user");
const {
  passportAuthenticator,
  googleAuthenticator,
} = require("./strategies/passportLocalStrategies");
const index = require("./routes/index");
const login = require("./routes/auth/login");
const signup = require("./routes/auth/signup");
const googleAuth = require("./routes/auth/googleAuth");
const logout = require("./routes/auth/logout");
const dashboard = require("./routes/admin/dashboard");
const admin = require("./routes/admin/admin");
const assignmentRoute = require("./routes/assignmentRoute");
const uploader = require("./routes/uploader");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("database connected");
  });

googleAuthenticator(passport, user);
passportAuthenticator(passport, user);

// middleware
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(express.static("public"));
app.use(require("express-ejs-layouts"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(
  cookie({
    maxAge: 30 * 60 * 60 * 1000,
    keys: ["soumenkhara"],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(require("express-flash")());
app.use(require("./functions/no-cache"));

// route middleware setting
app.use("/", index);
app.use("/login", login);
app.use("/signup", signup);
app.use("/logout", logout);
app.use("/auth/google", googleAuth);
app.use("/dashboard", dashboard);
app.use("/admin", admin);
app.use("/assignment", assignmentRoute);
app.use("/upload", uploader);
app.use("/resubmit", require("./routes/resubmit"));
app.use("/zip", require("./routes/zipRoute"));

app.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port 8080");
});
