const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const sessionConfig = require("./config/session");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
require("./config/passport");
const PORT = process.env.PORT || 8000;

//initialize app
const app = express();

//body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//set view engine and static files
app.set("view engine", "ejs");
app.set(express.static("public"));

//session middleware
app.use(session(sessionConfig));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash messages
app.use(flash());
// Optional: Make flash messages available in all views
app.use((req, res, next) => {
	res.locals.successMessages = req.flash("success");
	res.locals.errorMessages = req.flash("error");
	next();
});

//ROUTES
app.use("/auth", authRoutes);

//home route
app.get("/", (req, res) => {
	res.render("index", { user: req.user });
});

//dashboard route @protected
app.get("/dashboard", (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/auth/login");
	}
	res.render("dashboard", { user: req.user });
});

//test
// Add this temporarily to see session contents
app.use((req, res, next) => {
	console.log("Session data:", req.session);
	next();
});

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
