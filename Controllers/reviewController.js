const reviewsServices = require("../Services/ReviewsServices");

async function getReviewsByRestaurantName(req, res) {
    try {
        const reviews = await reviewsServices.getReviewsByRestaurantName(req.params.restaurantName);
        res.json({reviews});
    }
    catch (err) {
        res.status(404).send(err.message);
    }
}

async function addReview(req, res) {
    if(req.session.username == null){
        res.json({status: -1}) //not logged in
        return;
    }

    try {
        const review = await reviewsServices.createReview(req.session.username, req.body.restaurantName, req.body.rating);
        res.json({review});
    }
    catch (err) {
        res.json({status: -2}) //already reviewed
    }
}

async function updateReview(req, res) {
    try {
        const review = await reviewsServices.updateReview(req.body.username, req.body.restaurantName, req.body.rating);
        res.json({review});
    }
    catch (err) {
        res.status(404).send(err.message);
    }
}

async function deleteReview(req, res){
    try {
        const review = await reviewsServices.deleteReview(req.body.username, req.body.restaurantName);
        res.json({review});
    }
    catch (err) {
        res.status(404).send(err.message);
    }
}

async function getAvgRating(req, res){
    try {
        const avgRating = await reviewsServices.getAvgRating(req.body.restaurantName);
        if (avgRating.length == 0) throw Error(`No reviews for ${req.body.restaurantName} were found.`);
        res.json({avgRating: Math.floor(avgRating[0].avgRating)});
    }
    catch (err) {
        res.json({avgRating: "No Reviews Found"});
    }
}

module.exports = {
    getReviewsByRestaurantName,
    addReview,
    updateReview,
    deleteReview,
    getAvgRating
}