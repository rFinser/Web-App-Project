const express = require("express");
const router = express.Router();

const ordersController = require("../Controllers/orderController");

router.route("/orders").get(ordersController.getOrdersPage);
router.route('/MyOrders').post(ordersController.getOrders);
router.route("/restaurantOrders").post(ordersController.getProductsAndQuantity);
router.route("/allOrders").get(ordersController.getAllOrdersGroupedByUsers);
router.route("/allOrdersPage").get(ordersController.getAllOrdersPage);

module.exports = router;