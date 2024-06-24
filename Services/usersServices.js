const Users = require('../Models/usersModel')

async function login(email) {
    const user = findUser(email)
    return user
}

async function register(username, email, password, birthdate, admin) {
    new user = new Users({
        username, email, birthdate, password, admin
    })
    await user.save()
}

async function findUser(email) {
    const user = await Users.findOne({ email: email });
    return user
}

module.exports = {
    findUser, register, login
}