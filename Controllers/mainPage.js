const products = require('../Services/productsServices')
const users = require('../Services/usersServices')

function getMainPage(req,res){
    res.render('index.ejs');
}

async function getMainPageUser(req,res){
    const username = req.session.username
    try{
        const user = await users.findUser(username);
        res.json({username, isAdmin:user.u_admin});
    }
    catch(e){
        res.json({username, isAdmin:false});
    }
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