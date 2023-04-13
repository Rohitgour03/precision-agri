const jwt = require('jsonwebtoken')
const User = require('../models/user.models')


const getRegister = async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
}

const registerUser = async (req, res) => {
    try {
        await User.create({
            email: req.body.email,
            password: req.body.password,
        })
        res.json({status: 'ok'}); 
        alert('User is successfully registered !')
    } catch (error) {
        console.log(error);
        alert('This email is already registered !');
        res.json({status: 'error', error: 'Duplicate Email'}); 
    }
}


const getLogin = async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
}

const loginUser = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    if(user){
        const token = jwt.sign(
            {
                email: user.email
            },
            'secret123'
        )
        console.log(res.json({ status: 'ok', user: token}))
        return res.json({ status: 'ok', user: token})
    } else{
        return res.json({ status: 'error', user: false})
    }
}

const signoutUser = async (req, res) => {
    const token = req.headers['x-access-token']
    const decoded = jwt.verify(token, 'secret123')
    const obj = {status: 'ok', message: "User Logged out", decoded: decoded}
    return res.json(obj)
    // try {  
    //     const token = req.headers['x-access-token']
    //     const decoded = jwt.verify(token, 'secret123')
    //     const obj = {status: 'ok', message: "User Logged out", decoded: decoded}
    //     return res.json(obj)
    // } catch (error) {
    //     return res.json({status: 'error'})
    // }
    // try {
    //     const decoded = jwt.verify(token, 'secret123', (err, user) => {
    //         if(err){
    //             console.log(err)
    //             return res.status(403).json({message: "Authentication Failed"})
    //         }
    //     })  
    //     console.log("User successfully logged out")
    //     return res.json({status: 'ok', message: "User successfully logged out"})
    // } catch (error) {
    //     console.log(error)
    //     res.json({status: 'error'})
    // }
}


const dashboard = async (req, res) => {
    const token = req.headers['x-access-token']  
   
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.findOne({email: email})
        const sensorData = await SensorData.find({deviceId: 'soil-moisture-sensor'})

        res.json({status: 'ok', user: user, sensorData: sensorData, request: req})
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token'})
    }
}


module.exports = {
    getRegister,
    registerUser,
    getLogin, 
    loginUser,
    signoutUser,
    dashboard
}