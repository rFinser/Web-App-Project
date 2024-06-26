const Restaurant = require("../Models/Restaurant");
const Product = require("./productsServices");

async function createRestaurant(name, desc, iconPath, tags, address, location) {
    if (await findRestaurantByName(name) != null)
        throw Error(`A restaurant with the given name "${name}" already exists.`);

    let rest = new Restaurant({ r_name: name, r_description: desc, r_icon: iconPath, r_tags: tags, r_address: address, r_geolocation: location });
    await rest.save();
}

async function findRestaurantByName(name) {
    const rest = await Restaurant.findOne({ r_name: name })
    return rest; //either null or the actual restaurant
}

async function listAllRestaurants() {
    return await Restaurant.find();
}

async function updateRestaurant(restaurant_to_update, newName, newDesc, newIcon, newTags, newAddress, newLocation, newProducts) {
    if (await findRestaurantByName(restaurant_to_update) == null)
        throw Error(`No restaurant with the name "${restaurant_to_update}" was found.`);
    await Restaurant.updateOne({ r_name: restaurant_to_update }, { r_name: newName, r_description: newDesc, r_icon: newIcon, r_tags: newTags, r_address: newAddress, r_geolocation: newLocation, r_productsId: newProducts });
}

async function deleteRestaurant(restaurant_to_delete) {
    if (await findRestaurantByName(restaurant_to_delete) == null)
        throw Error(`No restaurant with the name "${restaurant_to_delete}" was found.`);
    await Restaurant.deleteOne({ r_name: restaurant_to_delete });
}

function isSubArray(array, subArray) {
    for (let i = 0; i < subArray.length; i++) {
        if (!array.includes(subArray[i]))
            return false;
    }
    return true;
}

async function searchByTags(tags) {
    let foundRestaurant = new Set();
    let restaurants = await listAllRestaurants();
    for (rest of restaurants) {
        if (rest.r_tags == null)
            continue;
        if (isSubArray(rest.r_tags, tags))
            foundRestaurant.add(rest);
    }
    return foundRestaurant;
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
    listAllRestaurants,
    updateRestaurant,
    deleteRestaurant,
    searchByTags,
    addProduct,
    removeProduct,
}