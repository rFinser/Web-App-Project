const Orders = require('../Models/Orders')

async function createOrder(orderId, userId, products, date){
    if(await findOrderById(orderId) != null)
        throw Error(`order: ${orderId} already exist`)

    const order = new Orders({
        o_orderId: orderId, o_userId: userId, o_productsId: products, o_date: date
    })
    await order.save()
}

async function findOrderById(orderId){
    return await Orders.findOne({o_orderId: orderId})
}

async function deleteOrder(orderId){
    if(await findOrderById(orderId) == null){
        throw Error(`order: ${orderId} not exists`)
    }
    await Orders.deleteOne({o_orderId:orderId})
}

async function updateOrder(orderId, userId, products,date){
    
    if(findOrderById(orderId) == null){
        throw Error(`order: ${orderId} not exist`) 
    }
    await Orders.updateOne({o_orderId: orderId}, {o_orderId: orderId, o_userId: userId, o_productsId: products, o_date: date})
}

async function showAllOrders(){
    return await Orders.find({})
}

module.exports = {
    createOrder,findOrderById, deleteOrder, updateOrder, showAllOrders
}