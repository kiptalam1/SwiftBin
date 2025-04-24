const crypto = require("crypto");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./database");

const sessionConfig = {
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: new PrismaSessionStore(prisma, {
		checkPeriod: 2 * 60 * 1000,
		dbRecordIdIsSessionId: true,
		sidFieldName: "sid", // Maps to your schema field
		sessionModelName: "session", // Explicit model name
	}),
	cookie: {
		maxAge: 24 * 60 * 60 * 1000, // 1 day
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
	},
};

module.exports = sessionConfig;
