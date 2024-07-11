const express = require("express");
const router = express.Router();

const usersController = require("../Controllers/usersController");

router.route("/users/:month").get(usersController.getUsersByRegistrationMonth);

module.exports = router;