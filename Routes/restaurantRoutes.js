const express = require("express");
const router = express.Router();

const restController = require("../Controllers/restaurantController");

router.route("/restaurants/:name").get(restController.getRestaurant);

module.exports = router;