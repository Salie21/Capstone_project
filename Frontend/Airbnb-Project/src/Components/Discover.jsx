import React from 'react'

// Imports the stylesheet for the Discover component
import './Discover.css'

// Defines the Discover component
const Discover = () => {
  return (
    <section className='discover_page'>
      <h2 className="discover_heading">Discover Airbnb Experiences</h2>
      
      {/* Card displaying in-person experiences */}
      <div className='discover_card'>
        <h3>Things to do on your trip</h3>
        <button>Experiences</button>
      </div>

      {/* Card displaying online experiences */}
      <div className='discover_Container'>
        <h3>Things to do from home</h3>
        <button>Online Experiences</button>
      </div>
    </section>
  )
}

export default Discover
