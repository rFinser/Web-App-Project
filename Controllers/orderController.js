const ordersServices = require('../Services/ordersServices');
const productsServices = require('../Services/productsServices');

async function getOrdersPage(req,res){
    const username = req.session.username
    if (username == null) {
        res.redirect("/login");
        return;
    }
    res.render('orders.ejs')
}

async function getOrders(req,res){
    const username = req.session.username
    
    const orders = await ordersServices.findOrderByUsername(username);

    let orderProducts = [];
    let Products = [];
    for(order of orders){
        for(productID of order.o_productsId){
            Products.push(await productsServices.findProductById(productID));
        }
        orderProducts.push(Products)
        Products = []
    }
    res.json({orderProducts, username});
}

module.exports ={
    getOrdersPage, getOrders
}