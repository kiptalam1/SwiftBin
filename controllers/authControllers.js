const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

function showRegisterPage(req, res) {
	res.render("auth/register", {
		error: null,
		formData: { username: "", email: "" },
	});
}

async function registerUser(req, res) {
	const { username, email, password } = req.body;

	// Basic validation (will be replaced with express-validator)
	if (!username || !email || !password) {
		return res.status(400).render("auth/register", {
			error: "All fields are required",
			formData: { username, email },
		});
	}
	try {
		//check if email exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).render("auth/register", {
				error: "Email already in use",
				formData: { username, email },
			});
		}
		// create user
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

		//auto-login user after registration,
		req.login(user, (error) => {
			if (error) {
				console.error("Auto-login error:", error);
				return res.redirect("/auth/login");
			}
			res.redirect("/dashboard");
		});
	} catch (error) {
		console.error("Registration error:", error);
		let message = "Registration failed. Please try again.";
		if (error.code === "P2002") {
			message = "Email already in use";
		}
		res.status(400).render("auth/register", {
			error: message,
			formData: { username, email },
		});
	}
}

async function logout(req, res) {
	req.logout((error) => {
		if (error) {
			console.error("Logout error:", error);
			return res
				.status(500)
				.render("error", { message: "Logout failed", error });
		}
		res.redirect("/");
	});
}

function showLoginPage(req, res) {
	res.render("auth/login", {
		error: req.query.error,
		formData: { email: req.query.email },
	});
}

module.exports = {
	showRegisterPage,
	registerUser,
	logout,
	showLoginPage,
};
