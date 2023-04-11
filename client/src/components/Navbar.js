import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/index'


const Navbar = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isLoggedIn = useSelector(state => state.isLoggedIn)

    function signup(e){
        navigate('/register')
    }
 
    async function handleLogout(e){

        const token = localStorage.getItem('token')
        const res = await fetch('http://45.79.125.11/signout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': token,
            },
        }) 
        const data = await res.json();
        console.log(data)
        
        if(data.status === 'ok'){
            dispatch(authActions.logout())
            console.log(isLoggedIn)
            alert('Successfully Logged Out')
            localStorage.removeItem('token')
            navigate("/login")
        } else{
            alert('Logging out failed, Please try again'); 
        }
    }

  return (
    <div className='navbar-ctn'>
        <div className='logo-ctn'>
            <p className='logo'>PrecisionAgri</p>
        </div>
        <nav>
            <ul className='nav-links'>
                <li className='nav-link'>
                    <a href="#home">Home</a>
                </li>
                <li className='nav-link'>
                    <a href="#our-product">Our Product</a>
                </li>
                <li className='nav-link'>
                    <a href="#product-features">Product Features</a>
                </li>
                <li className='nav-link'>
                    <a href="#about-us">About us</a>
                </li>
                <li className='nav-link'>
                    <a href="#contact-us">Contact us</a>
                </li>
            </ul>
        </nav>
        {
            !isLoggedIn ?
                <div className='signup-btn-ctn'>
                    <button className='signup-btn' onClick={(e) => signup(e)}>Sign up</button>
                </div> : 
                <div className='logout-btn-ctn'>
                    <button className='logout-btn' onClick={(e) => handleLogout(e)}>Log out</button>
                </div>
        }
    </div>
  )
}

export default Navbar