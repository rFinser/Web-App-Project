const users = require('../Services/usersServices')

function showSignupPage(req,res){
    res.render('signup.ejs')
}

function showLoginPage(req,res){
    res.render('login.ejs')
}

async function signup(req,res){
    try{
        await users.register(req.body.username,req.body.email,req.body.password,req.body.birthdate,false)
    }
    
    catch(e){
        console.log(e)
        res.json({status:-1})//email already exist
    }
}

async function login(req,res){
    const user = await users.findUser(req.body.email)
    console.log(req.body)
    console.log(user)
    if(user==null){
        res.json({status:-1})//email not exist
        return;
    }
    if(user.u_password != req.body.password){
        res.json({status:-2})//password doesnt match
    }
    //redirect to main page
}

module.exports={
    showSignupPage,showLoginPage,signup,login
}