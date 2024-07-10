const products = require('../Services/productsServices')

function getMainPage(req,res){
    res.render('index.ejs');
}

function getMainPageUser(req,res){
    const username = req.session.username;
    let isAdmin = false;
    if(['eyal', 'finser', 'aharoni'].includes(username))
    {
        isAdmin = true
    }
    res.json({username, isAdmin})
}

async function search(req,res){
    const Products = await products.findByName(req.body.name.toLowerCase());
    let results = [];
    if(Products.length <= 0){
        res.json({results:"Not Found"});
        return;
    }

    Products.forEach(product => {
        results.push(product.p_name)
    });
    res.json({results})
   
}

module.exports = {getMainPageUser,search,getMainPage}