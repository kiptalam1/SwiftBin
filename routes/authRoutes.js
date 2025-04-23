const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
	showRegisterPage,
	registerUser,
	logout,
	showLoginPage,
} = require("../controllers/authControllers");
const {
	ensureGuest,
	ensureAuthenticated,
} = require("../middlewares/authMiddleware");




//show register page
router.get("/register", ensureGuest, showRegisterPage);
//register handler
router.post("/register", ensureGuest, registerUser);
//show login page
router.get("/login", ensureGuest, showLoginPage);
//login handler
router.post(
	"/login",
	ensureGuest,
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/auth/login?error=Invalid credentials",
		failureFlash: false,
	})
);
//logout user
router.get("/logout", ensureAuthenticated, logout);

module.exports = router;
