const express = require("express");
const router = express.Router();

const usersController = require("../Controllers/usersController");

router.route("/users/:month").post(usersController.getUsersByRegistrationMonth);
router.route('/settings').get(usersController.isLoggedIn, usersController.getSettingsPage);
router.route('/userData').post(usersController.getUserData);
router.route('/deleteUserFromSettings').post(usersController.deleteUserFromSettings);
router.route('/updateUser').put(usersController.updateUser);
router.route('/isLoggedIn').get(usersController.isLoggedinJson);
router.route('/isAdmin').get(usersController.isAdmin);
router.route("/allUsers").post(usersController.getAllUsers);
router.route("/allUsersPage").get(usersController.getAllUsersPage);
router.route("/deleteUser").post(usersController.deleteUser);

module.exports = router;