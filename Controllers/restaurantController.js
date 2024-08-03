const restServices = require("../Services/restaurantsServices");
const prodServices = require("../Services/productsServices");
const usersServices = require("../Services/usersServices");
const reviewsServices = require("../Services/reviewsServices");

async function getRestaurantPage(req, res) {
    const restaurant = await restServices.findRestaurantByName(req.params.name);
    if (restaurant == null) {
        res.sendFile('restaurantNotFound.html', { root: './Views' });
    }
    else {
        res.sendFile('restaurantView.html', { root: './Views' });
    }
}

function getAllRestaurantsPage(req,res){
    res.sendFile('allRestaurants.html', { root: './Views' });
}

async function getRestaurant(req, res){

    let isAdmin = false
    if(req.session.username != null){
        const user = await usersServices.findUser(req.session.username);
        isAdmin = user.u_admin;
    }
    const restaurantName = req.body.restaurantName.split("%20").join(" ");
    const restaurant = await restServices.findRestaurantByName(restaurantName);
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
        await restServices.createRestaurant(req.body.r_name,req.body.r_description,req.body.r_icon,req.body.r_tags,req.body.r_geolocation)
        res.json({status: 1})
    }
    catch(e){
        res.json({status:-1})
    }
    res.end();
}
async function deleteRestaurant(req,res){
    const restaurant = await restServices.findRestaurantByName(req.params.id);
    const reviews = await reviewsServices.getReviewsByRestaurantName(req.params.id);
    for(const review of reviews){
        await reviewsServices.deleteReview(review.rev_username, review.rev_restaurantName);
    }
    for(const product of restaurant.r_productsId){
        await prodServices.deleteProduct(product);
    }
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
var selectedTags;
var selectedLocation;
var selectedRating;
function saveFilters(req,res){
    selectedTags = req.body.selectedTags;
    selectedLocation = req.body.selectedLocation;
    selectedRating = req.body.selectedRating;
    res.end();
}
function getRestaurantsFilters(req,res){
    res.sendFile('restaurantsFilters.html', {root: './Views'});
}

async function getRestaurantByFilters(req,res){
    const restaurantsTags = await restServices.searchByTags(selectedTags);
    const restaurantsSearched = [];
    if(selectedLocation != null && selectedRating!= null){
        const restaurantsLocation = await restServices.searchByLocation(selectedLocation);
        const restaurantsRating = await reviewsServices.getRestaurantsByRating(selectedRating);
        
        restaurantsTags.forEach(rest => {
            if (isInRestaurnats(restaurantsLocation, rest.r_name) && isInRestaurnats(restaurantsRating, rest.r_name)) {
                restaurantsSearched.push(rest);
            }
        });
    }
    else{
        restaurantsTags.forEach(rest => {
            restaurantsSearched.push(rest);
        })
    }
    
    res.json(restaurantsSearched);
}

function isInRestaurnats(restaurants, target){
    for(rest of restaurants){
        if(rest.r_name == target)
            return true;
    }
    return false;
}

async function getTopRatedRestaurants(req,res){
    const restaurants = await reviewsServices.getTopRatedRestaurants(req.body.top);
    res.json(restaurants);
}

module.exports = {
    getRestaurantPage,
    getRestaurant,
    getAllRestaurants,
    addRestaurant,
    deleteRestaurant,
    getRestaurantByName,
    updateRestaurant,
    getRestaurantByFilters,
    getRestaurantsFilters,
    saveFilters,
    getAllRestaurantsPage,
    getTopRatedRestaurants,
}