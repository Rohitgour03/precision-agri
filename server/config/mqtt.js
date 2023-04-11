const mqtt = require('mqtt')
const SensorData = require('../models/sensorData.models')

function connectMQTT(){
        
    const appId = "soil-moisture-001";
    const options = {
    port: 1883,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        username: 'soil-moisture-001@ttn',
        password: 'NNSXS.PAJ53APE4WZGLS7YPENTJESUZWHFHFTWES67WCI.6ZI556RFL7764ONH5IHGAZR5U43FQMVEDI44O6L2Q7MFJ7235KJQ',
        keepalive: 60,
        reconnectPeriod: 1000,
        connectionTimeout: 30*1000,
        protocolId: 'MQTT', //'MQIsdp'
        protocolVersion: 4,
        clean: true,
        encoding: 'utf8'
    }

    const mqttClient = mqtt.connect(`https://eu1.cloud.thethings.network`, options)

    mqttClient.on('connect', () => {
        mqttClient.subscribe(`#`);
        console.log(`Connected to the MQTT broker for app ${appId}`);
    });

    mqttClient.on('reconnect', function(){
        console.log('Trying to reconnect to MQTT broker');
    })

    mqttClient.on('error', (err) => {
        console.log('ERROR!', err);
    });

    mqttClient.on('message', async (topic, message) => {
        let data = JSON.parse(message.toString());
        console.log(data);

        try {
            await SensorData.create({
                deviceId: data.end_device_ids.device_id,
                applicationId: data.end_device_ids.application_id,
                payload: data.uplink_message.decoded_payload,
                timestamp: data.uplink_message.settings.timestamp,
                recievedAt: data.uplink_message.received_at,
            })
            console.log("data packet added to database");
            //res.json({status: 'Data packet recieved'})
        } catch (error) {
            console.log(error);
            console.log("Unable to add data packet to database");
            //res.json({status: 'error', error: 'Data could not be stored'}); 
        }
    });

    mqttClient.on('offline', function(){
        console.log('MQTT client went offline');
    })

    mqttClient.on('disconnect', function(){
        console.log('Got disconnected packet from TTN MQTT server!')
    })

    mqttClient.on('close', function(){
        console.log('Disconnected from TTN MQTT server!');
    })
}

module.exports = connectMQTT