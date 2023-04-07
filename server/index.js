// Initializing the server
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const mqtt = require('mqtt')
const dotenv = require('dotenv')
dotenv.config()

const User = require('./models/user.models.js')
const SensorData = require('./models/sensorData.models.js')

app.use(cors());            // cors is a middleware, fn which manipulates the response
app.use(express.json());    // using this middleware to parse the body as a json

// Parse URL-encoded bodies (as sent by HTML forms)
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))



// Connecting with database using the mongoose
mongoose.set('strictQuery', true);
const databaseUrl = process.env.MONGODB_URI; 
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


// Create server
var server = require("http").Server(app)
var io = require("socket.io")(server); 

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

const mqttClient = mqtt.connect(`https://eu1.cloud.thethings.network`, options);

// Global variable to save data
var globalMQTT = 0;

// SOCKET
/*
io.on("connection", function(socket)
{
  console.log("Client connected: " + socket.id);

  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected");
  });

  socket.on("REQUEST_GET_DATA", function() {
    socket.emit("SEND_DATA",globalMQTT);
  });

  function intervalFunc() {
    socket.emit("SEND_DATA", globalMQTT);
  }
  setInterval(intervalFunc, 2000);
});
*/

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
    // console.log(data.end_device_ids.device_id, data.uplink_message.decoded_payload, data.received_at);

    // var getDataFromTTN = JSON.parse(message);
    // console.log("Data from TTN: ", getDataFromTTN.uplink_message.frm_payload);
    // var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;
    // globalMQTT = Buffer.from(getFrmPayload, 'base64').toString();
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


app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/', (req, res) => {
    // res.send("Hello world!!!!!!!!!!!!")
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
})

// API endpoint for Registering the User
app.post('/register', async (req, res) => { 
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
    
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
})

// API endpoint for Logging the User
app.post('/login', async (req, res) => {  
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
})

app.post('/logout', async (req, res) => {

    const token = req.headers['x-access-token']
    console.log(token)
    try {
        const decoded = jwt.verify(token, 'secret123', (err, user) => {
            if(err){
                console.log(err)
                return res.status(403).json({message: "Authentication Failed"})
            }
        })
        console.log(decoded)
        localStorage.removeItem('token')
        console.log("User successfully logged out")
        return res.status(200).json({message: "User successfully logged out"})
    } catch (error) {
        console.log(error)
        res.json({status: 'error'})
    }
    
})

// API endpoint to show the Dashboard
app.get('/dashboard', async (req, res) => {

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
} )

const PORT = process.env.PORT || 5000;

// Server listening on the port 1337
app.listen(PORT, () => {
    console.log(`server started on the port ${PORT}`);
})

/*
{
    end_device_ids: {
      device_id: 'soil-moisture-sensor',
      application_ids: { application_id: 'soil-moisture-001' },
      dev_eui: '70B3D57ED005530E',
      join_eui: '0000000000000012',
      dev_addr: '260B2049'
    },
    correlation_ids: [
      'as:up:01GSVR42K142PZ6AX98AGF7KQC',
      'gs:conn:01GSVQH4NQBEJ60ZKVNNB1N5BF',
      'gs:up:host:01GSVQH4NY7STCH8CDKT85BYAP',
      'gs:uplink:01GSVR42C7HRYSVWSE1FX9AE2Z',
      'ns:uplink:01GSVR42CF0BD1PY5EPW94MZ1S',
      f_cnt: 33,    frm_payload: '/w==',
      decoded_payload: { moisture: 1023 },    rx_metadata: [ [Object] ],
      settings: {
        data_rate: [Object],
        frequency: '865402500',
        timestamp: 623153371
      },
      received_at: '2023-02-22T05:04:16.271818811Z',
      consumed_airtime: '0.046336s',
      network_ids: {
        net_id: '000013',
        tenant_id: 'ttn',
        cluster_id: 'eu1',
        cluster_address: 'eu1.cloud.thethings.network'        
      }
    }
  }


  {
  end_device_ids: {
    device_id: 'soil-moisture-sensor',
    application_ids: { application_id: 'soil-moisture-001' },
    dev_eui: '70B3D57ED005530E',
    join_eui: '0000000000000012',
    dev_addr: '260B2049'
  },
  correlation_ids: [
    'as:up:01GSVT3MVGX1DBW3Z5H67GWB8P',
    'gs:conn:01GSVQH4NQBEJ60ZKVNNB1N5BF',
    'gs:up:host:01GSVQH4NY7STCH8CDKT85BYAP',
    'gs:uplink:01GSVT3MMRQBA4GR47XKBTMX1Z',
    'ns:uplink:01GSVT3MMRN5E829KCXYQNTP8A',
    'rpc:/ttn.lorawan.v3.GsNs/HandleUplink:01GSVT3MMRHCPHY9QW5ZKFXM42',
    'rpc:/ttn.lorawan.v3.NsAs/HandleUplink:01GSVT3MVFW4Q71GQMH7GVWB3N'
  ],
  received_at: '2023-02-22T05:38:59.567905836Z',
  uplink_message: {
    session_key_id: 'AYZ3eWr1aTfhDj1JJpek3w==',
    f_port: 1,
    network_ids: {
      net_id: '000013',
      tenant_id: 'ttn',
      cluster_id: 'eu1',
      cluster_address: 'eu1.cloud.thethings.network'        
    }
  }
}

  */