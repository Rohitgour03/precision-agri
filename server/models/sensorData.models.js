const mongoose = require('mongoose');
const SensorData = new mongoose.Schema(
    {
        // We have to see the format of data coming from the TTN, then make the schema
        deviceId: {type: String},
        applicationId: {type: Object},
        payload: {type: Object},
        timestamp: {type: Number},
        recievedAt: {type: Date},
    }, 
    {
        collection: 'sensor-data'
    }
)

const model = mongoose.model('SensorData', SensorData);
module.exports = model;