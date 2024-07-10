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
        req.session.username = req.body.username
        res.json({status:1})
    }
    
    catch(e){
        console.log(e)
        res.json({status:-1})//username already exist
    }
}

async function login(req,res){
    console.log(req.body)
    const user = await users.findUser(req.body.username)
    if(['eyal','koriat','aharoni'].includes(user.u_username))
        await users.setAdmin(req.body.username)
    if(user==null){
        res.json({status:-1})//email not exist
    }
    else if(user.u_password != req.body.password){
        res.json({status:-2})//password doesnt match
    }
    else{
        req.session.username = req.body.username
        res.json({status:1})
    }
}


module.exports={
    showSignupPage,showLoginPage,signup,login,
}