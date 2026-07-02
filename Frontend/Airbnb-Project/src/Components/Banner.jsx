// Import React and the useState hook for managing component state
import React, { useState } from 'react'

//Import styling sheet for the bannerr
import './Banner.css'; 

//Import mui-icon
import Button from '@mui/material/Button';


//state variable called showSearch that controls whether the search bar (or search section) is visible. 
const Banner = () => {
       const [showSearch, setShowSearch] = useState(false);
  return (
    <div className='banner'>
        <div className='banner_search'> {showSearch && <h1>Show date picker</h1>}
               
//Mui icon used for banner button 
        <p className='banner_info'>Not sure where to go? Perfect.</p>
        <Button className='banner_button'>I'm flexible</Button>

        
        </div>
        </div>
  )
}

export default Banner
