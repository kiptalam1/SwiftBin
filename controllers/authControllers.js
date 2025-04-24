const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

function showRegisterPage(req, res) {
	res.render("auth/register", {
		error: req.flash("error")[0], // Get first error flash message
		formData: {
			username: req.flash("formData")[0]?.username || "",
			email: req.flash("formData")[0]?.email || "",
		},
	});
}

async function registerUser(req, res) {
	const { username, email, password } = req.body;

	// Basic validation
	if (!username || !email || !password) {
		req.flash("error", "All fields are required");
		req.flash("formData", { username, email });
		return res.redirect("/auth/register");
	}

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			req.flash("error", "Email already in use");
			req.flash("formData", { username, email });
			return res.redirect("/auth/register");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { username, email, password: hashedPassword },
		});

		req.login(user, (error) => {
			if (error) {
				req.flash("error", "Auto-login failed. Please login manually.");
				return res.redirect("/auth/login");
			}
			req.flash("success", "Registration successful!");
			return res.redirect("/dashboard");
		});
	} catch (error) {
		console.error("Registration error:", error);
		const message =
			error.code === "P2002"
				? "Email already in use"
				: "Registration failed. Please try again.";

		req.flash("error", message);
		req.flash("formData", { username, email });
		res.redirect("/auth/register");
	}
}

async function logout(req, res) {
	req.logout((error) => {
		if (error) {
			req.flash("error", "Logout failed");
			return res.redirect("/dashboard");
		}
		req.flash("success", "You have been logged out");
		res.redirect("/");
	});
}

function showLoginPage(req, res) {
	res.render("auth/login", {
		error: req.flash("error")[0],
		formData: { email: req.flash("formData")[0]?.email || "" },
	});
}

module.exports = {
	showRegisterPage,
	registerUser,
	logout,
	showLoginPage,
};
