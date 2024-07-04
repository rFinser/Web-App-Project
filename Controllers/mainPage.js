const products = require('../Services/productsServices')

function isLoggedin(req,res,next){
    
    if(req.session.username != null){
        return next()
    }
    else{
        res.render('index.ejs',{username:""})
    }
}

function getMainPageUser(req,res){
    const username = req.session.username
    res.render('index.ejs', {username})
}

async function search(req,res){
    const Products = await products.findByName(req.body.name.toLowerCase());
    let results = [];
    if(Products.length <= 0){
        res.json(["Not Found"]);
        return;
    }

    Products.forEach(product => {
        results.push(product.p_name)
    });
    res.json(results)
   
}

module.exports = {isLoggedin,getMainPageUser,search}