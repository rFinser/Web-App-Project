const express = require("express");
const router = express.Router();

const facebookApiController = require("../Controllers/facebookApiController");

router.route("/FBpost").post(facebookApiController.FBpost);

module.exports = router;