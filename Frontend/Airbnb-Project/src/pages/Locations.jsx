import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import LocationCard from '../Components/LocationCard.jsx'
import './Locations.css'

const Locations = () => {
  const [searchParams] = useSearchParams()
  const selectedLocation = searchParams.get('location') || ''
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const getListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/accommodations')
        setListings(response.data)
      } catch {
        setError('Could not load saved locations.')
      }
    }

    getListings()
  }, [])

  const visibleListings = useMemo(() => {
    if (!selectedLocation) {
      return listings
    }

    return listings.filter((listing) =>
      listing.location?.toLowerCase().includes(selectedLocation.toLowerCase())
    )
  }, [listings, selectedLocation])

  const headingLocation = selectedLocation || 'all locations'

  return (
    <main className="locations_page">
      <div className="locations_header">
        <p>{visibleListings.length} stays in {headingLocation}</p>
      </div>

      {error && <p className="locations_notice">{error}</p>}

      <section className="locations_list">
        {visibleListings.map((listing) => (
          <LocationCard key={listing._id} listing={listing} />
        ))}
      </section>

      {visibleListings.length === 0 && !error && (
        <p className="locations_empty">No stays found for this location.</p>
      )}
    </main>
  )
}

export default Locations
