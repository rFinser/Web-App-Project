const userServices = require("../Services/usersServices");


async function getUsersByRegistrationMonth(req, res){
    const month = req.params.month;
    const users = await userServices.getUsersByRegistrationMonth(month);
    res.json({users});
}


module.exports = {
    getUsersByRegistrationMonth
}