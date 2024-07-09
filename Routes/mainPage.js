const express = require('express')
const router = express.Router()

const mainPageController = require('../Controllers/mainPage')

router.route('/').get(mainPageController.getMainPage)
router.route('/mainPage').get(mainPageController.getMainPageUser)
router.route('/search').post(mainPageController.search)

module.exports = router