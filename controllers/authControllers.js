const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
	try {
		const { username, email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		// add credentials to the db
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

		//auto-login user after registration,
		req.login(user, (error) => {
			if (error) throw error;
			return res.redirect("/dashboard");
		});
	} catch (error) {
		let message = "Registration failed";
		if (error.code === "P2002") {
			message = "Email already in use";
		}
		res.status(400).render("auth/register", { error: message });
	}
}

async function logout(req, res) {
	req.logout((error) => {
		if (error) return res.status(500).send("Logout failed");
		res.redirect("/");
	});
}

module.exports = {
	registerUser,
	logout,
};
