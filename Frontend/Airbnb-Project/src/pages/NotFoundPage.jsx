import React, { useEffect, useState } from "react";
import './NotFoundPage.css';

const NotFoundPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`notFoundPage ${isVisible ? "visible" : ""}`}
    >
      <div className="contentWrapper">
        <div className="houseContainer">
          <div className="houseIcon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L4 9V21H20V9L12 3M12 5.8L18 10.2V19H6V10.2L12 5.8Z" />
              <path d="M9 14H15V21H9V14Z" />
            </svg>
          </div>
        </div>
        <h1 className="title">404</h1>
        <h2 className="subtitle">Oops! This space isn't available</h2>
        <p className="message">
          Looks like this rental has floated away. Let's find you another
          perfect stay.
        </p>
        <div className="buttonContainer">
          <button
            onClick={() => (window.location.href = "/home")}
            className="homeButton"
          >
            Take me home
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default NotFoundPage;
