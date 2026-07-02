// Import React and the useState hook for managing component state
import React, { useState } from 'react'

// Import the stylesheet for the Getaway component
import './Getaway.css'

// Array containing the category tabs displayed on the page
const tabs = [
  ...
]

// Object containing destinations grouped by category
const locations = {
  ...
}

const Getaway = () => {

  // Stores the currently selected destination category
  const [activeTab, setActiveTab] = useState('Destinations for arts & culture')

  // Controls whether all destinations or only a limited number are displayed
  const [showMore, setShowMore] = useState(false)

  // Retrieve the destinations for the selected category
  const currentLocations = locations[activeTab] || []

  // Display either all destinations or only the first 12
  const visibleLocations = showMore
    ? currentLocations
    : currentLocations.slice(0, 12)

  return (
    <section className="getaways">

      {/* Section heading */}
      <h2>Inspiration for future getaways</h2>

      {/* Display the destination category tabs */}
      <div className="getaways_tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={`getaways_tab ${activeTab === tab ? 'active' : ''}`}

            // Update the selected tab and collapse the list
            onClick={() => {
              setActiveTab(tab)
              setShowMore(false)
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Divider between the tabs and destination list */}
      <hr className="getaways_divider" />

      {/* Display the destinations for the selected category */}
      <div className="getaways_grid">
        {visibleLocations.map((location) => (
          <div
            className="getaways_item"
            key={`${activeTab}-${location.city}-${location.type}`}
          >
            <h3>{location.city}</h3>
            <p>{location.type}</p>
          </div>
        ))}
      </div>

      {/* Display the Show More button only when there are more than 12 destinations */}
      {currentLocations.length > 12 && (
        <button
          type="button"
          className="getaways_showmore"

          // Toggle between showing all destinations and the first 12
          onClick={() => setShowMore((current) => !current)}
        >
          {showMore ? 'Show less' : 'Show more'}
        </button>
      )}
    </section>
  )
}

// Export the component for use in other parts of the application
export default Getaway
