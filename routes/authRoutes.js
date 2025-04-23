const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("homepage");
});

router.get("/register", (req, res) => {
	res.send("register page");
});

module.exports = router;
