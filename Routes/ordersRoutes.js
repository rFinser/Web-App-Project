const express = require("express");
const router = express.Router();

const ordersController = require("../Controllers/orderController");

router.route("/orders").get(ordersController.getOrdersPage);
router.route('/MyOrders').get(ordersController.getOrders);
router.route("/restaurantOrders").post(ordersController.getProductsAndQuantity);
router.route("/allOrders").get(ordersController.getAllOrders);
router.route("/allOrdersPage").get(ordersController.getAllOrdersPage);

module.exports = router;