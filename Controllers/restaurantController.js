const restServices = require("../Services/restaurantsServices");
const prodServices = require("../Services/productsServices")

async function getRestaurant(req, res) {
    const restaurant = await restServices.findRestaurantByName(req.params.name);
    if (restaurant == null) {
        res.render('restaurantNotFound', { restName: req.params.name });
    }
    else {
        let restProducts = [];
        for (productId of restaurant.r_productsId) {
            restProducts.push(await prodServices.findProductById(productId));
        }
        res.render('restaurantView', { restaurant, products: restProducts });
    }
}

async function getAllRestaurants(req, res){
    const restaurants = await restServices.listAllRestaurants();
    res.json(restaurants);
}

async function addRestaurant(req,res){
    await restServices.createRestaurant(req.body.r_name,req.body.r_description,req.body.r_icon,[req.body.r_tags],req.body.r_adress)
    res.end();
}
async function deleteRestaurant(req,res){
    await restServices.deleteRestaurant(req.params.id);
    res.end();
}


module.exports = {
    getRestaurant,
    getAllRestaurants,
    addRestaurant,
    deleteRestaurant,
}