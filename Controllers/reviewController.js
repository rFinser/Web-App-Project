const reviewsServices = require("../Services/reviewsServices");

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
        //already reviewed, overwrite
        const newReview = await reviewsServices.updateReview(req.session.username, req.body.restaurantName, req.body.rating);
        res.json({review: newReview});
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
    if(req.session.username == null){
        res.json({status: -1}) //not logged in
        return;
    }

    try {
        const review = await reviewsServices.deleteReview(req.session.username, req.body.restaurantName);
        res.json({review});
    }
    catch (err) {
        //didnt review
        res.status(404).send(err.message);
    }
}

async function hasReviewed(req, res){
    if(req.session.username == null){
        res.json({hasReviewed: false}) //not logged in
        return;
    }

    const review = await reviewsServices.getReviewByRestaurantAndUser(req.body.restaurantName, req.session.username);
    if (review == null) res.json({hasReviewed: false}); //didnt review
    else res.json({hasReviewed: true}); //reviewed
}

async function getAvgRating(req, res){
        const avgRating = await reviewsServices.getAvgRating(req.body.restaurantName);
        res.json({avgRating: Math.floor(avgRating[0].avgRating)});
}

module.exports = {
    getReviewsByRestaurantName,
    addReview,
    updateReview,
    deleteReview,
    getAvgRating,
    hasReviewed
}