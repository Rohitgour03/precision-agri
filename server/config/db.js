const mongoose = require('mongoose')

function connectDB(){
    // Connecting with database using the mongoose
    mongoose.set('strictQuery', true)
    const databaseUrl = process.env.MONGODB_URI
    mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0', (err) => {
        if(err){
            console.log('unable to connect!!', err);
        } else {
            console.log('Successfully connected');
        }
    })

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('MongoDB database connection established successfully!');
    })
}

module.exports = connectDB