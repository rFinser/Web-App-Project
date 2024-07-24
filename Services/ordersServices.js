const Orders = require('../Models/Orders')
const productServices = require('./productsServices');

async function createOrder(userId, products, date){
    const order = new Orders({
        o_userId: userId, o_productsId: products, o_date: date
    });
    await order.save();
}

async function findOrderById(orderId){
    return await Orders.findOne({_id: orderId});
}

async function findOrderByUsername(username) {
    let groupedOrders = await groupOrdersByUserId();
    return groupedOrders.find(order => order._id === username);
}

async function deleteOrder(orderId){
    if(await findOrderById(orderId) == null){
        throw Error(`order: ${orderId} not exists`)
    }
    await Orders.deleteOne({_id:orderId});
}

async function updateOrder(orderId, userId, products,date){
    
    if(findOrderById(orderId) == null){
        throw Error(`order: ${orderId} not exist`) 
    }
    await Orders.updateOne({_id: orderId}, {o_userId: userId, o_productsId: products, o_date: date});
}

async function showAllOrders(){
    return await Orders.find({});
}

async function groupOrdersByUserId(){
    let groupedOrders = await Orders.aggregate([
        {
            $group:{
                _id: "$o_userId",
                totalOrders: {$sum: 1},
                orders: {$push: {productsId: "$o_productsId", date: "$o_date"}}
            },
        }
    ])

    //replace the orders productsId with the actual products
    for(const groupedOrder of groupedOrders){
        for(const order of groupedOrder.orders){
            for(let i=0; i < order.productsId.length; i++){
                const product = await productServices.findProductById(order.productsId[i]);
                order.productsId[i] = product;
            }
        }
    }

    return groupedOrders;
}

module.exports = {
    createOrder,findOrderById, deleteOrder, updateOrder, showAllOrders, findOrderByUsername, groupOrdersByUserId
}