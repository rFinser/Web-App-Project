const Product = require("../Models/Products");

async function createProduct(name, price, desc, tags) {
    let product = new Product({p_name: name, p_price: price, p_description: desc, p_tags: tags });
    await product.save();
    return product;
}

async function findProductById(id){
    const product = await Product.findOne({ _id: id });
    return product; //either null or the actual product, make sure to check
}

async function getAllProducts() {
    return await Product.find();
}

async function updateProduct(id_to_update, name, price, desc, tags) {
    if (await findProductById(id_to_update) == null)
        throw Error(`No product for ${id_to_update} was found.`);
    await Product.updateOne({ _id: id_to_update }, { _id: id_to_update, p_name: name, p_price: price, p_description: desc, p_tags: tags });
}

async function deleteProduct(id_to_delete) {
    if (await findProductById(id_to_delete) == null)
        throw Error(`No Product for ${id_to_delete} was found.`);
    await Product.deleteOne({ _id: id_to_delete });
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

async function findByName(name) {
    let foundProducts = await Product.find({p_name: {$regex: new RegExp('^.*'+name+'.*$')} });
    return foundProducts;
}

module.exports = {
    createProduct,
    findProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    findByTags,
    findByPrice,
    findByName,
}