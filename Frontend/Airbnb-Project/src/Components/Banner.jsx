import React, { useState } from 'react'
import './Banner.css'; 
import Button from '@mui/material/Button';



const Banner = () => {
       const [showSearch, setShowSearch] = useState(false);
  return (
    <div className='banner'>
        <div className='banner_search'> {showSearch && <h1>Show date picker</h1>}

        <p className='banner_info'>Not sure where to go? Perfect.</p>
        <Button className='banner_button'>I'm flexible</Button>

        
        </div>
        </div>
  )
}

export default Banner
