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
    if(Restaurants.length > 6){
        let rests = [];
        for(let i = 0; i < Restaurants.length; i++){
            if(Restaurants[i].r_name.toLowerCase() == req.body.name.toLowerCase()){
                rests.push(Restaurants[i]);
                Restaurants.splice(i,1);
                i--;
            }
        }
        let k = 0;
        for(let i = rests.length; i <6; i++){
            rests.push(Restaurants[k]);
            k++;
        }
        res.json(rests);
        return;
    }
    res.json(Restaurants);
}



module.exports = {getMainPageUser,search,getMainPage}