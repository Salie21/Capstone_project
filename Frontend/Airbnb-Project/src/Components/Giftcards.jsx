import React from 'react'
import './Giftcards.css'
import cards from '../assets/cards.png';  

const Giftcards = () => {
  return (
    <div className='giftcard-page-wrapper'>
      
      <div className='title'>
        <h1>Shop AirBnB gift cards</h1>
        <button>Learn more </button>
      </div>

      <div className='giftcard_Container'>
        <img src={cards} alt="Airbnb Gift Cards" />
      </div>

    </div>
  )
}

export default Giftcards
