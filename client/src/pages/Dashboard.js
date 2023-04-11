import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const columns = [
    { 
        id: 'deviceId', 
        label: 'DeviceId', 
        minWidth: 170 
    },
    { 
        id: 'moisture', 
        label: 'Soil Moisture', 
        minWidth: 200,
        align: 'right',
        format: (value) => value.toFixed(3), 
    },
    {
      id: 'recievedAt',
      label: 'Recieved at',
      minWidth: 300,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'timestamp',
      label: 'Timestamp',
      minWidth: 200,
      align: 'right',
    }
  ];


// import {useHistory} from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate();
    const [sensorData, setSensorData] = useState([]);
    //const [name, setName] = useState('Rohit');

    async function showDashboard(){
        const req = await fetch('http://45.79.125.11/dashboard', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        })

        const data = await req.json()
        setSensorData(data.sensorData)

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
        } else{
          navigate('/login')
        }
    }, [])

    const rows = sensorData.map(row => {
        const { deviceId, recievedAt, timestamp } = row;
        const moisture = row.payload.moisture;
        return { deviceId, moisture, recievedAt, timestamp  }
    })

    async function handlePredict(){
      const data20 = rows.slice(rows.length()-21, rows.length()-1)
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({data: data20})
      })
      const data = await res.json()
      console.log("Predicted data: ", data)
    }

    return <div className='dashboard'>
      <div className='page-ctn'>
        <Navbar />
        <header>
          <h1 className='heading'>Dashboard</h1>
        </header>
        <div className='table-ctn'>
          {StickyHeadTable(rows)}
        </div>

        <div className='graph-ctn'>
          {graph(rows)}
        </div>

        <div className='model-ctn'>
          <button onClick={handlePredict}>Predict Moisture data</button>
        </div>
      </div>
    </div>
    
  }

function StickyHeadTable(rows) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }

function graph(data){

  return (
    <ResponsiveContainer width="100%" height={500} >
      <AreaChart data={data} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f45c43" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f45c43" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="recievedAt" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="moisture" stroke="#f45c43" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Dashboard;





  //     const readings = sensorData.map((reading) => {
//         return (<tr>
//             <td>{reading.deviceId}</td>
//             <td>{reading.payload.moisture}</td>
//             <td>{reading.recievedAt}</td>
//             <td>{reading.timestamp}</td>
//         </tr>);
//     })

//     return <div className='App-header'>
//         <header>
//             <h1>User Dashboard!</h1>
//         </header>
//         <table>
//             <thead>
//                 <tr>
//                     <th>deviceId</th>
//                     <th>Moisture</th>
//                     <th>recievedAt</th>
//                     <th>timestamp</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {readings}
//             </tbody>
//         </table>

//     </div>
// }
