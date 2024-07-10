const express = require("express");
const router = express.Router();

const restController = require("../Controllers/restaurantController");

router.route("/restaurants/:name").get(restController.getRestaurant);
router.route("/restaurants").get(restController.getAllRestaurants);
router.route('/addRestaurant').post(restController.addRestaurant);
router.route('/delRestaurant:id').delete(restController.deleteRestaurant);

module.exports = router;