const Review = require("../Models/Review");
const usersServices = require("../Services/usersServices");

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

async function updateReview(id_to_update, rating) {
    if (await findReviewById(id_to_update) == null)
        throw Error(`No review for ${id_to_update} was found.`);
    await Review.updateOne({ _id: id_to_update }, { _id: id_to_update, rev_rating: rating});
}

async function deleteReview(id_to_delete) {
    if (await findReviewById(id_to_delete) == null)
        throw Error(`No Review for ${id_to_delete} was found.`);
    await Review.deleteOne({ _id: id_to_delete });
}

async function getReviewsByRestaurantName(restaurantName){
    return await Review.find({ rev_restaurantName: restaurantName });
}

module.exports = {
    createReview,
    findReviewById,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewsByRestaurantName
}