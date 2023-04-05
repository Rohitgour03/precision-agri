import {useState} from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function registerUser(event){
    event.preventDefault();
    const response = await fetch('http://45.79.125.11/register', {
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
    <div className="App-header">
      <header className="register-ctn">
        <h1>Register</h1>
        <form method='POST' onSubmit={(e) => registerUser(e)}>

            <div className="email-ctn">
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={email}
                className="email-input"
                onChange={ (e) => {
                  setEmail(e.target.value)
                }} 
                required />
              <label htmlFor="email">Email</label>
            </div>

            <div className="password-ctn">
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
              value="Sign up" 
              name="sign up" 
              id="signup"
              className='submit-btn'  />
              
            <p>Already have an account? <a href="/login">login</a></p>

        </form>
      </header>
    </div>
  );
}

export default App;




// <input 
//             type="email" 
//             name="email" 
//             id="email" 
//             placeholder="Email"
//             value={email}
//             className="email-input"
//             onChange={ (e) => setEmail(e.target.value)} />
//             <br />

//           <input 
//             type="password" 
//             name="password" 
//             id="password" 
//             placeholder="password"
//             value={password}
//             className="password-input"
//             onChange={ (e) => setPassword(e.target.value)} />
//             <br />

//           <input 
//             type="submit" 
//             value="submit"
//             className='submit-btn' />
