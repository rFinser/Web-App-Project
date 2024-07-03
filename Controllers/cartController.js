const userServices = require("../Services/usersServices");
const prodServices = require("../Services/productsServices");

async function getCartPage(req, res) {
    if (req.session.username == null) {
        res.redirect("/login");
        return;
    }

    const user = await userServices.findUser(req.session.username);
    if (user == null)
        res.redirect('/login');
    // res.json({ status: -1, msg: "Please Login First." });
    else {
        let userProducts = [];
        for (productId of user.u_cart) {
            userProducts.push(await prodServices.findProductById(productId));
        }
        res.render('cartView', { user, userProducts });
    }
}


module.exports = {
    getCartPage,
}