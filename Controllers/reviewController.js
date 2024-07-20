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

async function updateReview(req, res) {
    try {
        const review = await reviewsServices.updateReview(req.body.username, req.body.restaurantName, req.body.rating);
        res.json({review});
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

async function deleteReview(req, res){
    try {
        const review = await reviewsServices.deleteReview(req.body.username, req.body.restaurantName);
        res.json({review});
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

async function getAvgRating(req, res){
    try {
        const avgRating = await reviewsServices.getAvgRating(req.body.restaurantName);
        res.json({avgRating: avgRating[0].avgRating});
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    getReviewsByRestaurantName,
    addReview,
    updateReview,
    deleteReview,
    getAvgRating
}