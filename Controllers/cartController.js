const userServices = require("../Services/usersServices");
const prodServices = require("../Services/productsServices");
const orderServices = require("../Services/ordersServices");

function isLoggedIn(req,res, next){
    if(req.session.username != null){
        next();
    }
    else{
        res.status(400)
        res.end()
    }
}


async function getCartPage(req, res) {
    if(req.session.username != null){
        res.render('cartView');
    }
    else{
        res.redirect('/login')
        res.end()
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
    console.log(req.body)
    await userServices.addToCart(req.session.username, req.body.productId);
    res.end();
}

async function makePurchase(req, res){
    if(req.session.username == null){
        res.redirect('/login')
        return;
    }
    let user = await userServices.findUser(req.session.username);
    await orderServices.createOrder(req.session.username, user.u_cart, new Date().getTime().toString());
    await userServices.clearCart(req.session.username);
    res.redirect('/cart');
}

module.exports = {
    isLoggedIn, getCartPage, deleteProduct, makePurchase, getCartProducts, addProduct
}