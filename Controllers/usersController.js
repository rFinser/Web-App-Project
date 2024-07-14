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

module.exports = {
    getUsersByRegistrationMonth,
    getSettingsPage,
    isLoggedIn,
    getUserData,
    deleteUser,
}