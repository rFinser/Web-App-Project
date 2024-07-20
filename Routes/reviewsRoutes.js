const express = require('express')
const router = express.Router()
const reviewsController = require('../Controllers/reviewController');

router.route("/reviews/:restaurantName").get(reviewsController.getReviewsByRestaurantName)
router.route("/reviews/addReview").post(reviewsController.addReview)

module.exports = router
