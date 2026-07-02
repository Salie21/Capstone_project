import React from 'react'

//Imports styling for the page 
import './Discover.css'

// Defines Discover as a variable
const Discover = () => {
  return (
    <section className='discover_page'>
      <h2 className="discover_heading">Discover Airbnb Experiences</h2>
      
//Card on the right, static with button
      <div className='discover_card'>
        <h3>Things to do on your trip</h3>
        <button>Experiences</button>
      </div>
//Card on the left, static with button
      <div className='discover_Container'>
        <h3>Things to do from home</h3>
        <button>Online Experiences</button>
      </div>
    </section>
  )
}


export default Discover
