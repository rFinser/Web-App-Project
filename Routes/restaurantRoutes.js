const express = require("express");
const router = express.Router();

const restController = require("../Controllers/restaurantController");

router.route("/restaurants/:name").get(restController.getRestaurantPage);
router.route("/restaurant").post(restController.getRestaurant);
router.route("/restaurantName:name").get(restController.getRestaurantByName);
router.route("/restaurants").get(restController.getAllRestaurants);
router.route('/addRestaurant').post(restController.addRestaurant);
router.route('/delRestaurant:id').delete(restController.deleteRestaurant);
router.route('/updateRestaurant').put(restController.updateRestaurant);
router.route('/addProduct/:name').post(restController.addProduct)
router.route('/deleteProduct/:name').delete(restController.deleteProduct)

module.exports = router;