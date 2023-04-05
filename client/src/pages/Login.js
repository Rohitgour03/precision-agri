import {useState} from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function loginUser(event){
    event.preventDefault();
    const response = await fetch('http://45.79.125.11/login', {
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
    <div className="App-header">
      <header className="login-ctn">
        <h1>Login</h1>
        <form action="#" method='POST' onSubmit={(e) => loginUser(e)}>
          <div className='email-ctn'>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={email}
              className="email-input"
              onChange={ (e) => setEmail(e.target.value)}
              required />
              <label htmlFor="email">Email</label>
          </div>
          
          <div className='password-ctn'>
            <input 
              type="password" 
              name="password" 
              id="password" 
              value={password}
              className="password-input"
              onChange={ (e) => setPassword(e.target.value)}
              required />
              <label htmlFor="password">Password</label>
          </div>

          <input 
            type="submit" 
            value="submit"
            name="login"
            id="login"
            className='submit-btn' />

          <p>New User? <a href="/register">Register yourself</a></p>
        </form>
      </header>
    </div>
  );
}

export default App;
