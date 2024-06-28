const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
    p_id: { type: Number, required: true },
    p_name: { type: String, required: true },
    p_price: { type: Number, required: true },
    p_description: { type: String, required: true },
    p_tags: Array,
    p_restaurantName: { type: String, required: true },
});

module.exports = mongoose.model("Product", Product);
