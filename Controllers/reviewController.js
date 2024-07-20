const reviewsServices = require("../Services/ReviewsServices");

async function getReviewsByRestaurantName(req, res) {
    try {
        const reviews = await reviewsServices.getReviewsByRestaurantName(req.params.restaurantName);
        res.json({reviews});
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

async function addReview(req, res) {
    try {
        const review = await reviewsServices.createReview(req.body.username, req.body.restaurantName, req.body.rating);
        res.json({review});
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    getReviewsByRestaurantName,
    addReview
}