const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const sessionConfig = require("./config/session");
const passport = require("passport");
const PORT = process.env.PORT || 8000;

//initialize app
const app = express();

//body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//set view engine and static files
app.set("view engine", "ejs");
app.set(express.static("public"));

//session
app.use(session(sessionConfig));

//passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/auth", authRoutes);
//home route

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
