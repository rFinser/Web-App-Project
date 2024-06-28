const restServices = require("../Services/restaurantsServices");

async function getRestaurant(req, res) {
    if (await restServices.findRestaurantByName(req.params.name) == null) {
        res.render('restaurantNotFound', { restName: req.params.name });
    }
    else {
        res.render('restaurantView', { restaurant: restServices.findRestaurantByName(req.params.name) });
    }
}




module.exports = {
    getRestaurant,
}