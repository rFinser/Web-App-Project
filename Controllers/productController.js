const restServices = require("../Services/restaurantsServices");
const prodServices = require("../Services/productsServices");
const usersServices = require("../Services/usersServices");

async function getProduct(req,res){
    const product = await prodServices.findProductById(req.params.id);
    res.json(product);
}

async function addProduct(req,res){
    const newProduct = await prodServices.createProduct(req.body.name, req.body.price, req.body.desc, req.body.tags)
    const restName = req.params.name;
    const id = newProduct._id.toString()
    await restServices.addProduct(restName, id);
    res.json({id})
}

async function deleteProduct(req,res){
    const restName = req.params.name;
    await restServices.removeProduct(restName,req.body.id);
    await prodServices.deleteProduct(req.body.id);
    res.end();
}
async function updateProduct(req,res){
    await prodServices.updateProduct(req.body.id, req.body.name, req.body.price, req.body.desc, req.body.tags)
    res.end()
}

module.exports = {
    addProduct,
    deleteProduct,
    getProduct,
    updateProduct,
}