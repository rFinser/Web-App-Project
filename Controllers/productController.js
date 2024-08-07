const restServices = require("../Services/restaurantsServices");
const prodServices = require("../Services/productsServices");

async function getProduct(req,res){
    const product = await prodServices.findProductById(req.body.id);
    res.json(product);
}

async function addProduct(req,res){
    const restaurant = await restServices.findRestaurantByName(req.params.name);
    
    for(productId of restaurant.r_productsId){
        let product = await prodServices.findProductById(productId)
        if(product.p_name == req.body.name){
            res.json({status:-1});
            return;
        }
    }
    const newProduct = await prodServices.createProduct(req.body.name, req.body.price, req.body.desc, req.body.tags, req.body.img);
    const id = newProduct._id.toString()
    await restServices.addProduct(restaurant.r_name, id);
    res.json({id, status:1})
    res.end();
}

async function deleteProduct(req,res){
    const restName = req.params.name;
    await restServices.removeProduct(restName,req.body.id);
    await prodServices.deleteProduct(req.body.id);
    res.end();
}
async function updateProduct(req,res){
    const restaurant = await restServices.findRestaurantByName(req.params.name);

    for(productId of restaurant.r_productsId){
        let product = await prodServices.findProductById(productId)
        if(product.p_name == req.body.name && req.body.id != product._id.toString()){
            res.json({status:-1});
            return;
        }
    }
    
    await prodServices.updateProduct(req.body.id, req.body.name, req.body.price, req.body.desc, req.body.tags, req.body.img);
    res.json({status:1});
    res.end();
}

function intersection(array1, array2){
    let intersectionSet = new Set();
    for(let i = 0; i<array1.length; i++){
        for(let j = 0; j<array2.length; j++){
            if(array1[i]._id.toString() == array2[j]._id.toString()){
                intersectionSet.add(array1[i]._id.toString());
                break;
            }
        }
    }
    return intersectionSet;
}

async function productsFilter(req,res){
    const {tags, minPrice, maxPrice} = req.body;
    const rest = await restServices.findRestaurantByName(req.params.name)
    const priceFilter = await prodServices.findByPrice(minPrice,maxPrice);

    let ArrayProductsFilters =[];
    
    if(tags!=null){
        const tagsFilter = await prodServices.findByTags(tags);
        let productsFilters = intersection(priceFilter, tagsFilter);
        ArrayProductsFilters = Array.from(productsFilters);
    }
    else{
        let productsFilters = intersection(priceFilter, priceFilter);
        ArrayProductsFilters = Array.from(productsFilters);
    }

    let products = [];

    for(let i =0; i<rest.r_productsId.length; i++){
       for(let j = 0; j<ArrayProductsFilters.length; j++){
           if(rest.r_productsId[i] == ArrayProductsFilters[j]){
               products.push(await prodServices.findProductById(rest.r_productsId[i]));
               break;
           }
       }
    }
    res.json(products);
}



module.exports = {
    addProduct,
    deleteProduct,
    getProduct,
    updateProduct,
    productsFilter,
}