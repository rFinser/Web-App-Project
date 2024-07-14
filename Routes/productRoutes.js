const express = require("express");
const router = express.Router();

const prodController = require("../Controllers/productController");


router.route('/addProduct/:name').post(prodController.addProduct)
router.route('/deleteProduct/:name').delete(prodController.deleteProduct)
router.route('/getProduct:id').get(prodController.getProduct)
router.route('/updateProduct').put(prodController.updateProduct)


module.exports = router;