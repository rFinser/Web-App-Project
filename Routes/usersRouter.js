const express = require("express");
const router = express.Router();

const usersController = require("../Controllers/usersController");

router.route("/users/:month").get(usersController.getUsersByRegistrationMonth);
router.route('/settings').get(usersController.isLoggedIn, usersController.getSettingsPage);
router.route('/userData').get(usersController.getUserData);
router.route('/deleteUser').post(usersController.deleteUser);
router.route('/updateUser').put(usersController.updateUser);
router.route('/isLoggedIn').get(usersController.isLoggedinJson);
router.route('/isAdmin').get(usersController.isAdmin);
router.route("/allUsers").get(usersController.getAllUsers);
router.route("/allUsersPage").get(usersController.getAllUsersPage);

module.exports = router;