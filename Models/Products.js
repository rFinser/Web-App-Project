const Mongoose = require("mongoose");

const Product = new Mongoose.Schema({
    p_id: { type: Number, required: true },
    p_name: { type: String, required: true },
    p_price: { type: Number, required: true },
    p_description: { type: String, default: "This item has no available description." },
});

module.exports = Mongoose.model("Product", Product);
