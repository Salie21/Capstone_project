import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../Components/Header.jsx'
import LocationCard from '../Components/LocationCard.jsx'
import './LocationPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const LocationPage = () => {
  const [listings, setListings] = useState([])
  const { location } = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      const response = await axios.get(`${API_URL}/api/accommodations`)
      setListings(response.data)
    }
    fetchListings()
  }, [])

  return (
    <div className="location_page">
      <Header />
      <div className="location_page_content">
        <p>{listings.length} stays in {location}</p>
        <div className="location_listings">
          {listings.map((listing) => (
            <LocationCard key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationPage