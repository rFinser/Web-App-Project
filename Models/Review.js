const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new Schema({
    rev_username: { type: String, required: true },
    rev_restaurantName: { type: String, required: true },
    rev_rating: { type: Number, required: true },
})

module.exports = mongoose.model("Review", Review);