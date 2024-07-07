const userServices = require("../Services/usersServices");
const prodServices = require("../Services/productsServices");
const orderServices = require("../Services/ordersServices");

async function getCartPage(req, res) {
    if (req.session.username == null) {
        res.redirect("/login");
        return;
    }

    const user = await userServices.findUser(req.session.username);
    if (user == null)
        res.redirect('/login');
    else {
        res.render('cartView');
    }
}

async function getCartProducts(req, res){
    const user = await userServices.findUser(req.session.username);
    let userProducts = [];
    for (productId of user.u_cart) {
        userProducts.push(await prodServices.findProductById(productId));
    }
    res.json({products: userProducts});
}

async function deleteProduct(req,res){
    await userServices.deleteFromCart(req.session.username,req.params.id)
    res.end()
}

async function addProduct(req, res){
    await userServices.addToCart(req.session.username, req.body.productId);
    res.end();
}

async function makePurchase(req, res){
    if(req.session.username == ''){
        res.redirect('/login')
        return;
    }
    let user = await userServices.findUser(req.session.username);
    await orderServices.createOrder(req.session.username, user.u_cart, new Date().getTime().toString());
    await userServices.clearCart(req.session.username);
    res.redirect('/cart');
}

module.exports = {
    getCartPage, deleteProduct, makePurchase, getCartProducts, addProduct
}