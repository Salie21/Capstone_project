import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './Login.css'
import logo from '../assets/airbnb.svg'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmedUsername = username.trim()

    if (!trimmedUsername || !password) {
      setError('Please enter your username and password')
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        username: trimmedUsername,
        password
      })
      login(response.data.user, response.data.token)
      if (response.data.user.role === 'host') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Could not connect to the backend. Please make sure the server is running.')
      } else {
        setError(err.response?.data?.message || 'Invalid email or password')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login_page">
      <img
        src={logo}
        alt="Airbnb logo"
        className="login_logo"
      />

      <div className="login_container">
        <h1>Login</h1>

        {error && <p className="login_error">{error}</p>}

        <form onSubmit={handleSubmit} className="login_form">
          
          <div className="form_group">
            <label>Username</label>
            <input 
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="form_group">
            <label>Password</label>
            <input 
              type="password" 
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="button" className="forgot_password_btn">
            Forgot Password ?
          </button>

          <button type="submit" className="login_btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

        </form>

      </div>
    </div>
  )
}

export default Login
