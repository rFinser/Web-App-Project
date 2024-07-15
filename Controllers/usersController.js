const userServices = require("../Services/usersServices");

function isLoggedIn(req,res,next){
    if(req.session.username != null){
        next()
    }
    else{
        res.redirect('/login')
    }
}

async function getUsersByRegistrationMonth(req, res){
    const month = req.params.month;
    const users = await userServices.getUsersByRegistrationMonth(month);
    res.json({users});
}

function getSettingsPage(req,res){
    res.render('settings.ejs')
}
async function getUserData(req,res){
    const user = await userServices.findUser(req.session.username);

    res.json(user)
}

async function deleteUser(req,res){
    await userServices.deleteUser(req.session.username);
    req.session.destroy(() => {
        res.redirect('/');
    });
}

async function updateUser(req,res){
    try{
        await userServices.updateUser(req.session.username,req.body.username, req.body.email, req.body.birthday, req.body.password);
        req.session.username = req.body.username;
        res.json({status:1})
    }
    catch(e){
        res.json({status:-1}); //username taken
    }
}

async function isLoggedinJson(req, res){
    if(req.session.username == null){
        res.json({isLoggedIn: false, user: null});
    }
    else if(req.session.username != null){
        const u = await userServices.findUser(req.session.username);
        res.json({isLoggedIn: true, username: u.u_username});
    }
}

async function getAllUsers(req, res){
    const requestUser = await userServices.findUser(req.session.username);
    if(requestUser == null || requestUser.u_admin == false){
        res.status(404);
        res.end();
        return;
    }

    const users = await userServices.showAllUsers();
    res.json({users});
}

module.exports = {
    getUsersByRegistrationMonth,
    getSettingsPage,
    isLoggedIn,
    getUserData,
    deleteUser,
    updateUser,
    isLoggedinJson,
    getAllUsers,
}