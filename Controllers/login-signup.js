const users = require('../Services/usersServices')

function showSignupPage(req,res){
    res.sendFile("signup.html", {root: "./Views"});
}

function showLoginPage(req,res){
    res.sendFile('login.html', {root: './Views'})
}

async function signup(req,res){
    try{
        await users.register(req.body.username,req.body.email,req.body.password,req.body.birthdate,false)
        req.session.username = req.body.username
        res.json({msg:'user registered'})
    }
    catch(e){
        res.status(400).json({msg:'username alredy exist, please try a diffrent one'})
    }
}

async function login(req,res){ 
    const user = await users.findUser(req.body.username)
    
    if(user == null){
        res.status(400).json({msg:'username not found'})
    }
    else if(user.u_password != req.body.password){
        res.status(400).json({msg:'wrong password'})
    }
    else{
        if(['eyal','koriat','aharoni'].includes(user.u_username))
            await users.setAdmin(user.u_username);
        req.session.username = user.u_username;
        res.json({msg:'logged in'});
    }
}

function logout(req,res){
    req.session.destroy(() => {
        res.redirect('/');
    });
}


module.exports={
    showSignupPage,showLoginPage,signup,login,logout
}