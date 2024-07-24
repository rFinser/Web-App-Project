const express = require("express");
const router = express.Router();

const prodController = require("../Controllers/productController");


router.route('/addProduct/:name').post(prodController.addProduct)
router.route('/deleteProduct/:name').delete(prodController.deleteProduct)
router.route('/getProduct').post(prodController.getProduct)
router.route('/updateProduct/:name').put(prodController.updateProduct)
router.route('/productsSearched/:name').post(prodController.productsFilter)

module.exports = router;