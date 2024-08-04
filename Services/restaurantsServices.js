const Restaurant = require("../Models/Restaurant");
const Product = require("./productsServices");

async function createRestaurant(name, desc, iconPath, tags, location) {
    if (await findRestaurantByName(name) != null)
        throw Error(`A restaurant with the given name "${name}" already exists.`);

    let rest = new Restaurant({ r_name: name, r_description: desc, r_icon: iconPath, r_tags: tags, r_geolocation: location });
    await rest.save();
}

async function findRestaurantByName(name) {
    const rest = await Restaurant.findOne({ r_name: name })
    return rest; //either null or the actual restaurant
}

async function findRestaurantIncludesName(name) {
    let foundRestaurant = await Restaurant.find({r_name: {$regex: new RegExp('^.*'+name+'.*$', 'i')}});
    return foundRestaurant;
}

async function listAllRestaurants() {
    return await Restaurant.find();
}

async function updateRestaurant(restaurant_to_update, newName, newDesc, newIcon, newTags, newLocation, newProducts) {
    if (await findRestaurantByName(restaurant_to_update) == null)
        throw Error(`No restaurant with the name "${restaurant_to_update}" was found.`);
    else if(restaurant_to_update != newName && await findRestaurantByName(newName)!=null){
        throw Error(`restaurant with that name "${restaurant_to_update}" already exist.`);
    }
    await Restaurant.updateOne({ r_name: restaurant_to_update }, { r_name: newName, r_description: newDesc, r_icon: newIcon, r_tags: newTags, r_geolocation: newLocation, r_productsId: newProducts });
}

async function deleteRestaurant(restaurant_to_delete) {
    if (await findRestaurantByName(restaurant_to_delete) == null)
        throw Error(`No restaurant with the name "${restaurant_to_delete}" was found.`);
    await Restaurant.deleteOne({ r_name: restaurant_to_delete });
}


async function searchByTags(tags) {
    if(tags == null){
        return {};
    }
    let foundRestaurant = new Set();
    let restaurants = await listAllRestaurants();
    for (rest of restaurants) {
        if (rest.r_tags == null)
            continue;
        for (let i = 0; i < rest.r_tags.length; i++) {
            if (tags.includes( rest.r_tags[i]))
            {
                foundRestaurant.add(rest);
                break;
            }
        }   
    }
    return foundRestaurant;
}


async function searchByLocation(location) //location is array contains north, south, center
{
    if(location == null){
        return {};
    }
    let foundRestaurant = new Set();
    let restaurants = await listAllRestaurants();

    const south = {min_lat:29.4902, max_lat:31.5, min_lng: 34.25, max_lng:35.0, searched:false};
    const north = {min_lat: 32.5, max_lat:33.4167, min_lng:34.9, max_lng:35.8667, searched:false};
    const center = {min_lat: 31.5, max_lat:32.5, min_lng:34.5, max_lng:35.3, searched:false};

    if(location.includes('south'))
        south.searched = true;
    if(location.includes('north'))
        north.searched = true;
    if(location.includes('center'))
        center.searched = true;

    for (rest of restaurants) {
        if (rest.r_geolocation == null)
            continue;
        for (restLocation of rest.r_geolocation) {
            if(south.searched && isInRange(south.min_lat, south.max_lat, restLocation.lat) && isInRange(south.min_lng, south.max_lng, restLocation.lng)){
                foundRestaurant.add(rest);
                break;
            }
            if(north.searched && isInRange(north.min_lat, north.max_lat, restLocation.lat) && isInRange(north.min_lng, north.max_lng, restLocation.lng)){
                foundRestaurant.add(rest);
                break;
            }
            if(center.searched && isInRange(center.min_lat, center.max_lat, restLocation.lat) && isInRange(center.min_lng, center.max_lng, restLocation.lng)){
                foundRestaurant.add(rest);
                break;
            }
        }   
    }
    return foundRestaurant;
}

function isInRange(min,max,target){
    if(target>=min && target<=max)
        return true;
    return false;
}

async function addProduct(restaurantName, productId) {
    let rest = await findRestaurantByName(restaurantName);
    if (rest == null)
        throw Error(`No restaurant "${restaurantName}"`);

    if (await Product.findProductById(productId) == null)
        throw Error(`No such product with the id: "${productId}"`);

    if (rest.r_productsId.includes(productId))
        throw Error(`The product: "${productId}" is already in the restaurant: "${restaurantName}"`);

    rest.r_productsId.push(productId);
    await updateRestaurant(restaurantName, restaurantName, rest.r_description, rest.r_icon, rest.r_tags, rest.r_address, rest.r_geolocation, rest.r_productsId);
}

async function removeProduct(restaurantName, productId) {
    let rest = await findRestaurantByName(restaurantName);
    if (rest == null)
        throw Error(`No restaurant "${restaurantName}"`);

    if (await Product.findProductById(productId) == null)
        throw Error(`No such product with the id: "${productId}"`);

    if (!rest.r_productsId.includes(productId))
        throw Error(`The product: "${productId}" is not in the restaurant: "${restaurantName}"`);

    rest.r_productsId = rest.r_productsId.filter(val => val !== productId);
    await updateRestaurant(restaurantName, restaurantName, rest.r_description, rest.r_icon, rest.r_tags, rest.r_address, rest.r_geolocation, rest.r_productsId);
}

module.exports = {
    createRestaurant,
    findRestaurantByName,
    findRestaurantIncludesName,
    listAllRestaurants,
    updateRestaurant,
    deleteRestaurant,
    searchByTags,
    addProduct,
    removeProduct,
    searchByLocation
}