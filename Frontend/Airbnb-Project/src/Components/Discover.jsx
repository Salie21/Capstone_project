// Import React to create the component
import React from 'react';

// Import the CSS file for styling the Discover component
import './Discover.css';

// Discover component
const Discover = () => {
  return (
    // Main section for the Discover page
    <section className="discover_page">

      {/* Main heading */}
      <h2 className="discover_heading">
        Discover Airbnb Experiences
      </h2>

      {/* Card on the right displaying in-person experiences */}
      <div className="discover_card">
        <h3>Things to do on your trip</h3>
        <button>Experiences</button>
      </div>

      {/* Card on the left displaying online experiences */}
      <div className="discover_container">
        <h3>Things to do from home</h3>
        <button>Online Experiences</button>
      </div>

    </section>
  );
};

// Export the Discover component for use in other parts of the application
export default Discover;
