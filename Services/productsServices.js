const Product = require("../Models/Products");

async function createProduct(id, name, price, desc, tags, restaurantName) {
    //id is key
    if (await findProductById(id) != null)
        throw Error(`A product already exists for ${id}`);
    let product = new Product({ p_id: id, p_name: name, p_price: price, p_description: desc, p_tags: tags, p_restaurantName: restaurantName });
    await product.save();
}

async function findProductById(id) {
    const product = await Product.findOne({ p_id: id });
    return product; //either null or the actual product, make sure to check
}

async function getAllProducts() {
    return await Product.find();
}

async function updateProduct(id_to_update, name, price, desc, tags, restaurantName) {
    if (await findProductById(id_to_update) == null)
        throw Error(`No product for ${id_to_update} was found.`);
    await Product.updateOne({ p_id: id_to_update }, { p_id: id_to_update, p_name: name, p_price: price, p_description: desc, p_tags: tags, p_restaurantName: restaurantName });
}

async function deleteProduct(id_to_delete) {
    if (await findProductById(id_to_delete) == null)
        throw Error(`No Product for ${id_to_delete} was found.`);
    await Product.deleteOne({ p_id: id_to_delete });
}

function isSubArray(array, subArray) {
    for (let i = 0; i < subArray.length; i++) {
        if (!array.includes(subArray[i]))
            return false;
    }
    return true;
}

async function findByTags(tags) {
    let foundProducts = new Set();
    const products = await getAllProducts();
    for (const product of products) {
        if (product.p_tags == null)
            continue;
        if (isSubArray(product.p_tags, tags))
            foundProducts.add(product);
    }
    return foundProducts;
}

async function findByPrice(minPrice, maxPrice) {
    let foundProducts = await Product.find({ p_price: { $gte: minPrice, $lte: maxPrice } });
    return foundProducts;
}

module.exports = {
    createProduct,
    findProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    findByTags,
    findByPrice
}