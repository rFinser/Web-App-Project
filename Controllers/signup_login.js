//const user = require('../Services/usersServices')

function signupForm(req,res){
    
    res.render('signup.ejs')
}

function loginForm(req,res){
    res.render('login.ejs')
}

module.exports = {
    signupForm,
    loginForm,
}