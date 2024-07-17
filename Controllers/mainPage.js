const users = require('../Services/usersServices')
const restaurants = require('../Services/restaurantsServices')

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
    const Restaurants = await restaurants.findRestaurantIncludesName(req.body.name.toLowerCase());
    let results = [];

    Restaurants.forEach(restaurant => {
        results.push(restaurant.r_name)
    });
    res.json({results})
}



module.exports = {getMainPageUser,search,getMainPage}