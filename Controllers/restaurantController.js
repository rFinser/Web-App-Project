const restServices = require("../Services/restaurantsServices");
const prodServices = require("../Services/productsServices")

async function getRestaurantPage(req, res) {
    const restaurant = await restServices.findRestaurantByName(req.params.name);
    if (restaurant == null) {
        res.render('restaurantNotFound');
    }
    else {
        res.render('restaurantView');
    }
}

async function getRestaurant(req, res){
    const restaurant = await restServices.findRestaurantByName(req.body.restaurantName);
    if (restaurant == null){
        res.status(404)
        res.end()
    }
    else{
        let products = [];
        for(productId of restaurant.r_productsId){
            products.push(await prodServices.findProductById(productId));
        }
        res.json({restaurant, products});
    }
}

async function getAllRestaurants(req, res){
    const restaurants = await restServices.listAllRestaurants();
    res.json(restaurants);
}

module.exports = {
    getRestaurantPage,
    getRestaurant,
    getAllRestaurants,
}