import React, { useEffect, useState } from 'react';
// import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
// import {useHistory} from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate();
    const [sensorData, setSensorData] = useState([]);
    //const [name, setName] = useState('Rohit');

    async function showDashboard(){
        const req = await fetch('http://localhost:1337/api/dashboard', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        })

        const data = await req.json()
        setSensorData(data.sensorData)
        console.log(sensorData);

        if(data.status === 'ok'){
            alert("User successfully authenticated")
        } else{
            alert(data.error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            const user = (token) => {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(window.atob(base64));
            };

            if(!user(token)){
                localStorage.removeItem('token')
                navigate('/login')
            } else{
                showDashboard();
            }
        }
    }, [])

   

    const readings = sensorData.map((reading) => {
        return (<tr>
            <td>{reading.deviceId}</td>
            <td>{reading.payload.moisture}</td>
            <td>{reading.recievedAt}</td>
            <td>{reading.timestamp}</td>
        </tr>);
    })

    return <div>
        <h1>User Dashboard!</h1>
        <table>
            <thead>
                <tr>
                    <th>deviceId</th>
                    <th>Moisture</th>
                    <th>recievedAt</th>
                    <th>timestamp</th>
                </tr>
            </thead>
            <tbody>
                {readings}
            </tbody>
        </table>

    </div>
}

export default Dashboard;