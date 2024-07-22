const Review = require("../Models/Review");
const usersServices = require("./usersServices");
const restaurantsServices = require('./restaurantsServices')

async function createReview(username, restaurantId, rating) {
    if (await usersServices.findUser(username) == null)
        throw Error(`No user for ${username} was found.`);

    if (await getReviewByRestaurantAndUser(restaurantId, username) != null)
        throw Error(`User ${username} already reviewed ${restaurantId}.`);

    let review = new Review({ rev_username: username, rev_restaurantName: restaurantId, rev_rating: rating});
    await review.save();
    return review;
}

async function getReviewByRestaurantAndUser(restaurantName, username) {
    return await Review.findOne({ rev_username: username, rev_restaurantName: restaurantName });
}

async function findReviewById(id) {
    const review = await Review.findOne({ _id: id });
    return review;
}

async function getAllReviews() {
    return await Review.find();
}

async function updateReview(username, restaurantName, rating) {
    const review = await getReviewByRestaurantAndUser(restaurantName, username);
    if (review == null)
        throw Error(`No Review for ${username} at ${restaurantName} was found.`);

    await Review.updateOne({ _id: review._id }, { rev_rating: rating });
}

async function deleteReview(username, restaurantName) {
    const review = await getReviewByRestaurantAndUser(restaurantName, username);
    if (review == null)
        throw Error(`No Review for ${username} at ${restaurantName} was found.`);

    await Review.deleteOne({ _id: review._id });
}

async function getReviewsByRestaurantName(restaurantName){
    return await Review.find({ rev_restaurantName: restaurantName });
}

async function getAvgRating(restaurantName){
    const review = await Review.aggregate([
        { $match: { rev_restaurantName: restaurantName } },
        { $group: { _id: "$rev_restaurantName", avgRating: { $avg: "$rev_rating" } } }
    ]);
    if(review.length == 0){
        return [{_id:restaurantName, avgRating:0}];
    }
    return review;
}

async function getRestaurantsByRating(rating) //rating number from 0 to 5
{
    const restaurants = await restaurantsServices.listAllRestaurants();
    const foundedRestaurants = new Set();
    for(rest of restaurants){
        if((await getAvgRating(rest.r_name)).length == 0){
            continue;
        }
        else if((await getAvgRating(rest.r_name))[0].avgRating >= rating){
            foundedRestaurants.add(rest)
        }
    }
    return foundedRestaurants;
}

async function getTopRatedRestaurants(Top) //Top number of restaurants to return
{
    var allRestaurants = await restaurantsServices.listAllRestaurants();
    var maxRating = -1;
    var restaurant = null;

    var topRestaurants = [];

    for(let i = 0; i < Top; i++){
        maxRating = -1;
        for (let i = 0; i<allRestaurants.length; i++) {
            const avgRating = (await getAvgRating(allRestaurants[i].r_name))[0].avgRating;
            if (avgRating > maxRating) {
                maxRating = avgRating;
                restaurant = allRestaurants[i];
            }
        }
        if (restaurant) {
            topRestaurants.push(restaurant);
            allRestaurants = allRestaurants.filter(rest => rest.r_name !== restaurant.r_name);
        }
    }

    return topRestaurants;
}

module.exports = {
    createReview,
    findReviewById,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewsByRestaurantName,
    getAvgRating,
    getRestaurantsByRating,
    getTopRatedRestaurants,
}