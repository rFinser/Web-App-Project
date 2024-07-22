const express = require('express');
const router = express.Router();
const reviewsController = require('../Controllers/reviewController');

router.route("/reviews/:restaurantName").get(reviewsController.getReviewsByRestaurantName);
router.route("/reviews/addReview").post(reviewsController.addReview);
router.route("/reviews/updateReview").post(reviewsController.updateReview);
router.route("/reviews/deleteReview").post(reviewsController.deleteReview);
router.route("/reviews/getAvgRating").post(reviewsController.getAvgRating);
router.route("/reviews/hasReviewed").post(reviewsController.hasReviewed);

module.exports = router
