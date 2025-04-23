const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const prisma = require("./database");

passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { email } });
				if (!user) {
					return done(null, false, { message: "Incorrect email." });
				}
				const isValidPassword = await bcrypt.compare(password, user.password);
				if (!isValidPassword) {
					return done(null, false, { message: "Incorrect password." });
				}
				return done(null, user);
			} catch (error) {
				console.error(error);
				return done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

module.exports = passport;
