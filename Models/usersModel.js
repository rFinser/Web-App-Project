const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    birthdate:{
        type: Date,
        required: true
    },
    password:{
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Users', Users);