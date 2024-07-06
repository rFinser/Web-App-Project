const express = require("express");
const router = express.Router();

const cartController = require("../Controllers/cartController");

router.route("/cart").get(cartController.getCartPage);
router.route("/cart:id").delete(cartController.deleteProduct);
router.route("/cart/purchase").post(cartController.makePurchase);
router.route("/cart/products").get(cartController.getCartProducts);

module.exports = router;