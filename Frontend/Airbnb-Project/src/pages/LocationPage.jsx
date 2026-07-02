import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import LocationCard from '../Components/LocationCard.jsx'
import './LocationPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const LocationPage = () => {
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const { location } = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/accommodations`)
        const accommodations = Array.isArray(response.data) ? response.data : []
        setListings(
          accommodations.filter((listing) =>
            listing.location?.toLowerCase().includes((location || '').toLowerCase())
          )
        )
      } catch {
        setError('Could not load stays for this location.')
      }
    }
    fetchListings()
  }, [location])

  return (
    <div className="location_page">
      <div className="location_page_content">
        <p>{listings.length} stays in {location}</p>
        {error && <p className="locations_notice">{error}</p>}
        <div className="location_listings">
          {listings.map((listing) => (
            <LocationCard key={listing._id} listing={listing} />
          ))}
        </div>
        {listings.length === 0 && !error && (
          <p className="locations_empty">No stays found for this location.</p>
        )}
      </div>
    </div>
  )
}

export default LocationPage
