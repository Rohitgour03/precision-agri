// Initializing the server
const express = require('express')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db');
const connectMQTT = require('./config/mqtt')
const jwt = require('jsonwebtoken')
// const tf = require('@tensorflow/tfjs-node')
const app = express()

app.use(cors());            // cors is a middleware, fn which manipulates the response
app.use(express.json());    // using this middleware to parse the body as a json

// Parse URL-encoded bodies (as sent by HTML forms)
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

const PORT = process.env.PORT || 5000;

connectDB()
connectMQTT()

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
})

app.get('/api/hello', (req, res) => {
  res.json({message: "Hello Dost kaisa hai tu"})
})
app.use('/api/users', require('./routes/userRoutes'))

app.post('/signout', async (req, res) => {
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
  //     return res.json({status: 'error', error: error})
  // }
})

// app.post('/predict', async (req, res) => {
//   const data = req.body.data;
//   const inputTensor = tf.tensor(data);
//   const model = await tf.loadLayersModel('./MLModel/lstm_model.json');
//   model.loadWeights('./MLModel/lstm_model_weights.h5');
//   const prediction = model.predict(inputTensor);
//   res.json({ prediction: prediction.dataSync() });
// })

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

  */


