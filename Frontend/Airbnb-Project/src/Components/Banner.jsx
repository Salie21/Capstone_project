// Import React to create the component
import React from 'react';

// Import the CSS file for styling the Banner component
import './Banner.css';

// Import the Material UI Button component
import Button from '@mui/material/Button';

// Banner component
const Banner = () => {
  return (
    // Main banner container
    <div className="banner">

      {/* Container for the banner content */}
      <div className="banner_search">

        {/* Display the banner message */}
        <p className="banner_info">
          Not sure where to go? Perfect.
        </p>

        {/* Material UI button displayed on the banner */}
        <Button className="banner_button">
          I'm flexible
        </Button>

      </div>
    </div>
  );
};

// Export the Banner component so it can be used in other files
export default Banner;
