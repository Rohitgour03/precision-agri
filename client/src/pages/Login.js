import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function loginUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:1337/api/login', {
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

    if(data.user){
      alert('Login successful')
      localStorage.setItem('token', data.user);
      navigate("/dashboard")
    } else{
      alert('Please check your username and password'); 
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Login</h1>
        <form action="#" method='POST' onSubmit={(e) => loginUser(e)}>
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
