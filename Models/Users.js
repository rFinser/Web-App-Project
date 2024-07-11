const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const date = new Schema({
    day: {type: Number, required: true},
    month: {type: Number, required:true},
    year: {type: Number, required:true},
});
const User = new Schema({
    u_username: { type: String, required: true },
    u_email: { type: String, required: true }, 
    u_birthdate: {type:date, required: true},
    u_password: { type: String, required: true },
    u_registrationDate: {type: date, required: true},
    u_admin: { type: Boolean, required: true },
    u_cart: {type:Array, default:[]},
})

module.exports = mongoose.model("User", User);