import React from 'react'
import './Inspiration.css'
import sandtonImage from '../assets/Sandton.jpg'
import johannesburgImage from '../assets/Johannesburg.jpg'
import woodmeadImage from '../assets/Woodmed.jpg'
import hydeParkImage from '../assets/Hydepark placeholder.jpg'

const inspirationCards = [
  {
    title: 'Sandton City Hotel',
    distance: '53 km away',
    image: sandtonImage,
  },

  {
    title: 'Joburg City Hotel',
    distance: '168 km away',
    image: johannesburgImage,
  },

  {
    title: 'Woodmead Hotel',
    distance: '30 miles away',
    image: woodmeadImage,
  },
  {
    title: 'Hyde Park Hotel',
    distance: '34 km away',
    image: hydeParkImage,
  },
]

const Inspiration = () => {
  return (
    <section className="inspiration">
      <h1>Inspiration for your next trip</h1>
      <div className="inspiration_cards">
        {inspirationCards.map((card) => (
          <article className="inspiration_card" key={card.title}>
            <img src={card.image} alt={card.title} />
            <div className="inspiration_info">
              <h3>{card.title}</h3>
              <p>{card.distance}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Inspiration
