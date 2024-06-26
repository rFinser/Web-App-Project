const Product = require("../Models/Products");

/***
 * Creates a Product with the given params, unless a product with the given id already exists, in which case it throws an error
 */
async function createProduct(id, name, price, desc) {
    //id is key
    if (await findProductById(id) != null)
        throw Error(`A product already exists for ${id}`);
    let product = new Product({ p_id: id, p_name: name, p_price: price, p_description: desc });
    await product.save();
}

/***
 * @param {Number} id id of the product to find 
 * @returns the product doc or null incase it doesnt exist
 */
async function findProductById(id) {
    const product = await Product.findOne({ id });
    return product; //either null or the actual product, make sure to check
}

/***
 * @returns All of the products as a list
 */
async function getAllProducts() {
    return await Product.find();
}

async function updateProduct(id_to_update, name, price, desc) {
    if (await findProductById(id_to_update) == null)
        throw Error(`No product for ${id_to_update} was found.`);
    await Product.updateOne({ id: id_to_update }, { id: id_to_update, p_name: name, p_price: price, p_description: desc });
}

async function deleteProduct(id_to_delete) {
    if (await findProductById(id_to_delete) == null)
        throw Error(`No Product for ${id_to_delete} was found.`);
    await Product.deleteOne({ id: id_to_delete });
}

module.exports = {
    createProduct,
    findProductById,
    getAllProducts,
    updateProduct,
    deleteProduct
}