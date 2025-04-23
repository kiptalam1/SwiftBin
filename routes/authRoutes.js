const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authControllers");

router.get("/register", registerUser);

module.exports = router;
