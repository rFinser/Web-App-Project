const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Orders = new Schema({
    orderId: {type:Number, required:true},
    userId: {type:String, required:true},
    products: {type:Array, default:[]},
    date:{type:Date, required:true},
});

module.exports = mongoose.model("Orders",Orders);