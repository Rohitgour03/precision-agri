import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function registerUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:1337/api/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    
    const data = await response.json();
    console.log(data);

    if(data.status === 'ok'){
      navigate('/login');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Register</h1>
        <form action="#" method='POST' onSubmit={(e) => registerUser(e)}>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Email"
            value={email}
            onChange={ (e) => setEmail(e.target.value)} />
            <br />

          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="password"
            value={password}
            onChange={ (e) => setPassword(e.target.value)} />
            <br />

          <input 
            type="submit" 
            value="submit" />
        </form>
      </header>
    </div>
  );
}

export default App;
