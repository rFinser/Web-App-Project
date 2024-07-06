const Users = require('../Models/Users')

function getAge(user, age){
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    if(year - user.u_birthdate.year > age || 
        (year - user.u_birthdate.year == age && month - user.u_birthdate.month > 0) ||
        (year - user.u_birthdate.year == age && month - user.u_birthdate.month == 0 && day - user.u_birthdate.day >= 0)){
            return true
    }
    else{
        return false
    }

}

async function addToCart(username,productId){
    const u = await findUser(username);
    if(u!=null){
        u.u_cart.push(productId)
        const updateCart= u.u_cart;
        await Users.updateOne({u_username:username},{u_cart:updateCart});
    }
    else{
        throw Error(`user not exist, id: ${username}`)
    }
}
async function deleteFromCart(username,productId){
    const u = await findUser(username);
    if(u!=null){
        for(i=0; i< u.u_cart.length; i++){
            if(u.u_cart[i] == productId){
                u.u_cart.splice(i,1);
                const updateCart= u.u_cart;
                await Users.updateOne({u_username:username},{u_cart:updateCart});
                return;
            }
        }
        throw Error(`product no exist in cart, id:${productId}`)
    }
    else{
        throw Error(`user not exist, id: ${username}`)
    }
}

async function register(username, email, password, birthdate, admin) {
    const u = await findUser(username)
    if(u == null){
        const user = new Users({
            u_username:username, u_email:email, u_birthdate:birthdate, u_password:password, u_admin:admin
        });
        await user.save()
    }
    else{
        throw Error(`user exist, username: ${username}`)
    }
}

async function findUser(username) {
    const user = await Users.findOne({u_username: username});
    return user
}

async function findUserByAge(age){
    
    const users = await showAllUsers()
    const usersFound = new Set()

    for(const user of users){
        if(getAge(user,age)){
            usersFound.add(user)
        }
    }
    return usersFound
}

async function showAllUsers(){
    return await Users.find({})
}

async function deleteUser(username){
    const u = await findUser(username)
    if(u != null){
        await Users.deleteOne({u_username:username}) 
    }
    else{
        throw Error(`user not exist, id: ${username} `)
    }
}

async function updateUser(username, email, birthday, password){
    const u = await findUser(email)
    if(u != null){
        await  Users.updateOne({u_username: username}, {u_username:username, u_email:email, u_birthday:birthday, u_password:password}) 
    }
    else{
        throw Error(`user not exist, id: ${username}`)
    }
}

module.exports = {
    findUser, register, deleteUser, updateUser, showAllUsers,findUserByAge,deleteFromCart,addToCart
}
