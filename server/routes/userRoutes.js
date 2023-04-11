const express = require('express')
const router = express.Router()

const {
    getRegister,
    registerUser,
    getLogin,
    loginUser,
    signoutUser,    
} = require('../controllers/userController')

router.route('/register').get(getRegister).post(registerUser)
router.route('/login').get(getLogin).post(loginUser)
// router.route('/signout').post(signoutUser)
// router.post('/signout', signoutUser)
 
module.exports = router