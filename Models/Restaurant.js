const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Restaurant = new Schema({
    r_name: { type: String, required: true },
    r_description: { type: String, required: true },
    r_icon: String, //path to the image
    r_tags: Array,
    r_address: { type: String, required: true },
    r_geolocation: { type: Array, required: true }, //coordinates (longitude, latitude), would be helpful when using maps api
})

module.exports = mongoose.model("Restaurant", Restaurant);