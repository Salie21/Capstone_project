/*Import useState hook to control the visibility of the dropdown menu
Icons needed for the project */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/airbnb.svg'
import './AdminHeader.css'

//Code used to display the users name wheb logged in
const getName = (user) => {
  if (!user) {
    return 'Host'
  }

  return user.username || 'Host'
}

//Retrives the logged-in users information
const AdminHeader = () => {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // returns header and logo
  return (
    <header className="admin_header">
      <Link to="/home" className="admin_logo_link">
        <img src={logo} alt="Airbnb logo" className="admin_logo" />
      </Link>


      <div className="admin_profile_area">
        <span>Welcome, {getName(user)}</span>
        <button
          className="admin_profile_button"
          type="button"
          aria-label="Open profile menu"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MenuIcon />
          <AccountCircleIcon />
        </button>

        {showMenu && (
          <div className="admin_dropdown">
            <Link to="/admin/reservations">View Reservations</Link>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default AdminHeader
