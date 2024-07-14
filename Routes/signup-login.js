const express = require('express');
const router = express.Router();

const loginController  = require('../Controllers/login-signup');


router.route("/signup").get(loginController.showSignupPage);
router.route("/login").get(loginController.showLoginPage);
router.route('/signup').post(loginController.signup);
router.route('/login').post(loginController.login);
router.route('/logout').post(loginController.logout);

module.exports = router;