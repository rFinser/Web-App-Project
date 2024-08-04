const ordersServices = require('../Services/ordersServices');
const productsServices = require('../Services/productsServices');
const restaurantServices = require('../Services/restaurantsServices');
const userServices = require("../Services/usersServices");

async function getOrdersPage(req, res) {
    const username = req.session.username
    if (username == null) {
        res.redirect("/login");
        return;
    }
    res.sendFile('MyOrders.html', { root: './Views' });
}

async function getOrders(req, res) {
    const username = req.session.username;
    const orders = await ordersServices.findOrderByUsername(username);

    res.json({ orders });
}

async function getAllOrdersGroupedByUsers(req, res){
    const ordersData = await ordersServices.groupOrdersByUserId();
    res.json({ordersData});
}

async function getAllOrdersPage(req, res){
    const requestUser = await userServices.findUser(req.session.username);
    if(requestUser == null || requestUser.u_admin == false){
        res.status(404);
        res.end();
        return;
    }

    res.sendFile("AllOrders.html", {root: "./Views"});
}

async function getProductsAndQuantity(req, res) {
    const orders = await ordersServices.showAllOrders();
    const restName = req.body.restaurant.split("%20").join(" ");
    console.log(restName);
    const rest = await restaurantServices.findRestaurantByName(restName);

    let productsData = [];
    for (const order of orders) {
        for (const productId of order.o_productsId) {
            if (!rest.r_productsId.includes(productId)) continue;

            const existingProduct = productsData.find(product => product.productId === productId);
            if (existingProduct) {
                existingProduct.count++;
            } else {
                const prod = await productsServices.findProductById(productId)
                const product = {
                    productId,
                    count: 1,
                    name: prod.p_name
                };
                productsData.push(product);
            }
        }
    }

    for(const productId of rest.r_productsId){
        let found = false
        for(const productData of productsData){
            if(productData.productId == productId){
                found = true
                break;
            }
        }

        if(!found){
            const prod = await productsServices.findProductById(productId)
            const product = {
                productId,
                count: 0,
                name: prod.p_name
            };
            productsData.push(product);
        }
    }

    res.json({ products: productsData });
}

module.exports = {
    getOrdersPage, getOrders, getProductsAndQuantity, getAllOrdersGroupedByUsers, getAllOrdersPage, 
}