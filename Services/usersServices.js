const Users = require('../Models/usersModel')//change to ../Models/usersModel

async function login(id) {
    const user = findUser(id)
    //user not exsist, need to register
    if (user == null) {
        //TODO
    }
    return user
}

async function register(id, username, email, password, birthdate, admin) {
    new user = new Users({
        id, username, email, birthdate, password, admin
    })
    await user.save()
}

async function findUser(id) {
    const user = await Users.findOne({ id: id });
    return user
}
