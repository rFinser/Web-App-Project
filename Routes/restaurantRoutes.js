const express = require("express");
const router = express.Router();

const restController = require("../Controllers/restaurantController");

router.route("/restaurants/:name").get(restController.getRestaurantPage);
router.route("/restaurant").post(restController.getRestaurant);
router.route("/restaurants").get(restController.getAllRestaurants);

module.exports = router;