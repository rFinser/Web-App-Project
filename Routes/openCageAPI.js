const express = require("express");
const router = express.Router();

const openCageApiController = require("../Controllers/openCageAPI");

router.route("/openCageLatLng").post(openCageApiController.getLatLng);

module.exports = router;