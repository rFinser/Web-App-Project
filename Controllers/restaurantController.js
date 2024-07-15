const restServices = require("../Services/restaurantsServices");
const prodServices = require("../Services/productsServices");
const usersServices = require("../Services/usersServices");

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

    let isAdmin = false
    if(req.session.username != null){
        const user = await usersServices.findUser(req.session.username);
        isAdmin = user.u_admin;
    }

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
        res.json({restData:{restaurant, products} , isAdmin});
    }
}

async function getRestaurantByName(req, res){
    const restaurant = await restServices.findRestaurantByName(req.params.name);
    res.json(restaurant)
}

async function getAllRestaurants(req, res){
    const restaurants = await restServices.listAllRestaurants();
    res.json(restaurants);
}
async function addRestaurant(req,res){
    try{
        await restServices.createRestaurant(req.body.r_name,req.body.r_description,req.body.r_icon,[req.body.r_tags],req.body.r_address)
        res.json({status: 1})
    }
    catch(e){
        res.json({status:-1})
    }
    res.end();
}
async function deleteRestaurant(req,res){
    await restServices.deleteRestaurant(req.params.id);
    res.end();
}

async function updateRestaurant(req,res){
    try{
        await restServices.updateRestaurant(req.body.id,req.body.name,req.body.desc,req.body.icon,req.body.tags,req.body.address,req.body.geo)
        res.json({status: 1});
    }
    catch(e){
        res.json({status: -1})
    }
    res.end()
}


module.exports = {
    getRestaurantPage,
    getRestaurant,
    getAllRestaurants,
    addRestaurant,
    deleteRestaurant,
    getRestaurantByName,
    updateRestaurant,
}