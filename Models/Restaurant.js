const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const location = new Schema({
    address: String,
    lat: Number,
    lng: Number,
});

const Restaurant = new Schema({
    r_name: { type: String, required: true },
    r_description: { type: String, required: true },
    r_icon: String, //image url
    r_tags: Array,
    r_geolocation: { type: Array, required: true }, //array coordinates (lat, lng, address), would be helpful when using maps api
    r_productsId: { type: [location], required: true},
});

module.exports = mongoose.model("Restaurant", Restaurant);