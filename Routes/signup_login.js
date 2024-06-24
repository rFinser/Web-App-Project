const express = require("express");
const router = express.Router();

const loginController  = require('../Controllers/signup_login'); 

router.route("/signup").get(loginController.signupForm);
router.route("/login").get(loginController.loginForm);

module.exports = router;
