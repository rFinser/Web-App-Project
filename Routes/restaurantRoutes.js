const express = require("express");
const router = express.Router();

const restController = require("../Controllers/restaurantController");

router.route("/restaurants/:name").get(restController.getRestaurantPage);
router.route("/restaurant").post(restController.getRestaurant);
router.route("/restaurantName/:name").post(restController.getRestaurantByName);
router.route("/restaurants").get(restController.getAllRestaurants);
router.route('/addRestaurant').post(restController.addRestaurant);
router.route('/delRestaurant:id').delete(restController.deleteRestaurant);
router.route('/updateRestaurant').put(restController.updateRestaurant);
router.route('/searchedRestaurants').get(restController.getRestaurantsFilters);
router.route('/saveFilters').post(restController.saveFilters);
router.route('/restaurantsFilters').post(restController.getRestaurantByFilters);
router.route('/allRestaurants').get(restController.getAllRestaurantsPage);
router.route('/TopRatedRestaurants').post(restController.getTopRatedRestaurants);


module.exports = router;