import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AdminHeader from '../../Components/AdminHeader'
import { useAuth } from '../../context/useAuth'
import fallbackListingImage from '../../assets/accommodation/Tablemountain.avif'
import './ViewListings.css'
import API_URL from '../../utils/api'
const assetModules = import.meta.glob('../../assets/**/*.{jpg,jpeg,png,avif,webp}', {
  eager: true,
  import: 'default',
})
const assetMap = Object.fromEntries(
  Object.entries(assetModules).map(([path, src]) => [
    decodeURIComponent(path.split('/').pop()).toLowerCase(),
    src,
  ])
)
const fallbackImage = fallbackListingImage || assetMap['sandton.jpg'] || assetMap['endlessviews.avif']

const ViewListings = () => {
  const { token } = useAuth()
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState('')

  const resolveImage = (listing) => {
    const firstImage = listing.images?.[0] || listing.image || ''

    if (!firstImage) {
      return fallbackImage
    }

    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url
    }

    if (typeof firstImage !== 'string') {
      return fallbackImage
    }

    if (/^(https?:|data:|blob:)/i.test(firstImage)) {
      return firstImage
    }

    const imageName = decodeURIComponent(firstImage).split('/').pop().toLowerCase()
    return assetMap[imageName] || fallbackImage
  }

  const handleImageError = (event) => {
    event.currentTarget.src = fallbackImage
  }

  const getListings = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const response = await axios.post(`${API_URL}/api/accommodations/host/claim-featured`, {}, { headers })
      setListings(Array.isArray(response.data) ? response.data : [])
    } catch {
      try {
        const response = await axios.get(`${API_URL}/api/accommodations/host`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setListings(Array.isArray(response.data) ? response.data : [])
      } catch {
        setError('Could not load listings')
      }
    }
  }, [token])

  const deleteListing = async (listingId) => {
    setDeletingId(listingId)
    setError('')

    try {
      await axios.delete(`${API_URL}/api/accommodations/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setListings((currentListings) =>
        currentListings.filter((listing) => listing._id !== listingId)
      )
    } catch {
      setError('Could not delete listing')
    } finally {
      setDeletingId('')
    }
  }

  useEffect(() => {
    if (token) {
      getListings()
    }
  }, [getListings, token])

  return (
    <div className="view_listings">
      <AdminHeader />

      <nav className="view_listings_nav" aria-label="Admin navigation">
        <Link to="/admin/reservations">View Reservations</Link>
        <Link to="/admin/listings">View Listings</Link>
        <Link to="/admin/create">Create Listing</Link>
      </nav>

      <main className="view_listings_content">
        <h1>My Listings</h1>
        {error && <p className="view_listings_error">{error}</p>}

        <div className="view_listings_grid">
          {listings.map((listing) => (
            <article className="view_listing_card" key={listing._id}>
              <div className="view_listing_media">
                <img
                  src={resolveImage(listing)}
                  alt={listing.title}
                  onError={handleImageError}
                />
              </div>

              <div className="view_listing_info">
                <p>{listing.type || 'Listing'} {listing.location ? `- ${listing.location}` : ''}</p>
                <h2>{listing.title}</h2>
                <span>
                  {listing.guests || 0} guest{listing.guests === 1 ? '' : 's'} - {listing.type || 'Property'} - {listing.bedrooms || 0} bedroom{listing.bedrooms === 1 ? '' : 's'} - {listing.bathrooms || 0} bathroom{listing.bathrooms === 1 ? '' : 's'}
                </span>
                {listing.amenities?.length > 0 && (
                  <span>Amenities: {listing.amenities.join(', ')}</span>
                )}
              </div>

              <strong className="view_listing_price">${listing.price || 0}/night</strong>

              <div className="view_listing_actions">
                <Link className="view_listing_button" to={`/listing/${listing._id}`}>View</Link>
                <Link className="view_listing_button secondary" to={`/admin/update/${listing._id}`}>Update</Link>
                <button
                  type="button"
                  disabled={deletingId === listing._id}
                  onClick={() => deleteListing(listing._id)}
                >
                  {deletingId === listing._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {listings.length === 0 && !error && (
          <p className="view_listings_empty">No listings have been created yet.</p>
        )}
      </main>
    </div>
  )
}

export default ViewListings
