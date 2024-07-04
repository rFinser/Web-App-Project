const express = require('express')
const router = express.Router()

const mainPageController = require('../Controllers/mainPage')

router.route('/').get(mainPageController.isLoggedin,mainPageController.getMainPageUser)
router.route('/search').post(mainPageController.search)

module.exports = router