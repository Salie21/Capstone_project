// Import React and the useState hook for managing component state
// Import the stylesheet for the Getaway component
import React, { useState } from 'react'
import './Getaway.css'

//Code containing  the category tabs displayed on the page
const tabs = [
  'Destinations for arts & culture',
  'Destinations for outdoor adventure',
  'Mountain cabins',
  'Beach destinations',
  'Popular destinations',
  'Unique Stays',
]

//containing destinations grouped by category
const locations = {
  'Destinations for arts & culture': [
    { city: 'Eiffel Tower', type: 'Paris, France' },
    { city: 'Statue of Liberty', type: 'New York, USA' },
    { city: 'Shibuya Crossing', type: 'Tokyo, Japan' },
    { city: 'Big Ben', type: 'London, UK' },
    { city: 'Colosseum', type: 'Rome, Italy' },
    { city: 'Sydney Opera House', type: 'Sydney, Australia' },
    { city: 'Table Mountain', type: 'Cape Town, South Africa' },
    { city: 'Sagrada Familia', type: 'Barcelona, Spain' },
    { city: 'Great Wall', type: 'Beijing, China' },
    { city: 'Christ the Redeemer', type: 'Rio de Janeiro, Brazil' },
    { city: 'Santorini', type: 'Santorini, Greece' },
    { city: 'Grand Canyon', type: 'Arizona, USA' },
  ],
  'Destinations for outdoor adventure': [
    { city: 'Lake Tahoe', type: 'California' },
    { city: 'Banff', type: 'Canada' },
    { city: 'Moab', type: 'Utah' },
    { city: 'Sedona', type: 'Arizona' },
  ],
  'Mountain cabins': [
    { city: 'Aspen', type: 'Colorado' },
    { city: 'Blue Ridge', type: 'Georgia' },
    { city: 'Big Bear Lake', type: 'California' },
    { city: 'Gatlinburg', type: 'Tennessee' },
  ],
  'Beach destinations': [
    { city: 'Malibu', type: 'California' },
    { city: 'Miami Beach', type: 'Florida' },
    { city: 'Cancun', type: 'Mexico' },
    { city: 'Cape Town', type: 'South Africa' },
  ],
  'Popular destinations': [
    { city: 'Amsterdam', type: 'Netherlands' },
    { city: 'New York', type: 'New York' },
    { city: 'Paris', type: 'France' },
    { city: 'Rome', type: 'Italy' },
  ],
  'Unique Stays': [
    { city: 'Treehouses', type: 'United States' },
    { city: 'Tiny homes', type: 'Worldwide' },
    { city: 'Castles', type: 'Europe' },
    { city: 'Domes', type: 'Worldwide' },
  ],
}


  // Controls whether all destinations or only a limited number are displayed and retrieves  the destinations for the selected category
const Getaway = () => {
  const [activeTab, setActiveTab] = useState('Destinations for arts & culture')
  const [showMore, setShowMore] = useState(false)

  const currentLocations = locations[activeTab] || []
  const visibleLocations = showMore ? currentLocations : currentLocations.slice(0, 12)

  return (
    <section className="getaways">
      <h2>Inspiration for future getaways</h2>

      <div className="getaways_tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={`getaways_tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab)
              setShowMore(false)
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <hr className="getaways_divider" />

      <div className="getaways_grid">
        {visibleLocations.map((location) => (
          <div className="getaways_item" key={`${activeTab}-${location.city}-${location.type}`}>
            <h3>{location.city}</h3>
            <p>{location.type}</p>
          </div>
        ))}
      </div>

      {currentLocations.length > 12 && (
        <button
          type="button"
          className="getaways_showmore"
          onClick={() => setShowMore((current) => !current)}
        >
          {showMore ? 'Show less' : 'Show more'}
        </button>
      )}
    </section>
  )
}

export default Getaway

// Export the component for use in other parts of the application
export default Getaway
