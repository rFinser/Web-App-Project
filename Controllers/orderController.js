const ordersServices = require('../Services/ordersServices');
const productsServices = require('../Services/productsServices');
const restaurantServices = require('../Services/restaurantsServices');

async function getOrdersPage(req, res) {
    const username = req.session.username
    if (username == null) {
        res.redirect("/login");
        return;
    }
    res.render('orders.ejs')
}

async function getOrders(req, res) {
    const username = req.session.username

    const orders = await ordersServices.findOrderByUsername(username);

    let orderProducts = [];
    let Products = [];
    for (order of orders) {
        for (productID of order.o_productsId) {
            Products.push(await productsServices.findProductById(productID));
        }
        orderProducts.push(Products)
        Products = []
    }
    res.json({ orderProducts, username });
}

async function getProductsAndQuantity(req, res) {
    const orders = await ordersServices.showAllOrders();
    const rest = await restaurantServices.findRestaurantByName(req.body.restaurant);

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

    res.json({ products: productsData });
}

module.exports = {
    getOrdersPage, getOrders, getProductsAndQuantity
}