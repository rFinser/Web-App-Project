const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    u_username: { type: String, required: true },
    u_email: { type: String, required: true }, 
    u_birthdate: { type: Date, required: true },
    u_password: { type: String, required: true },
    u_admin: { type: Boolean, required: true }
})

module.exports = mongoose.model("User", User);