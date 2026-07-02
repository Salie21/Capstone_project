import React from 'react'
import './Discover.css'


const Discover = () => {
  return (
    <section className='discover_page'>
      <h2 className="discover_heading">Discover Airbnb Experiences</h2>

      <div className='discover_card'>
        <h3>Things to do on your trip</h3>
        <button>Experiences</button>
      </div>

      <div className='discover_Container'>
        <h3>Things to do from home</h3>
        <button>Online Experiences</button>
      </div>
    </section>
  )
}


export default Discover
