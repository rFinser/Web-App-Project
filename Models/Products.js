const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
    p_name: { type: String, required: true },
    p_price: { type: Number, required: true },
    p_description: { type: String, required: true },
    p_tags: Array,
    p_img: { type: String}, //image url
});

module.exports = mongoose.model("Product", Product);
