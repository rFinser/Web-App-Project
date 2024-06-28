const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Orders = new Schema({
    o_orderId: {type:Number, required:true},
    o_userId: {type:String, required:true},
    o_productsId: {type:Array, default:[]},
    o_date:{type:Date, required:true},
});

module.exports = mongoose.model("Orders",Orders);