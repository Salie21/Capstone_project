import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import AdminHeader from '../../Components/AdminHeader'
import './Dashboard.css'
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
const fallbackImage = assetMap['sandton.jpg'] || assetMap['endlessviews.avif']
const featuredListingPatterns = [
  /central\s+studio\s+apt.*sandton\s+city.*rosebank.*pool.*gym/i,
  /luxury\s+balcony\s+retreat.*rooftop\s+pool.*city\s+views/i,
]

const isFeaturedHostListing = (listing) => {
  return featuredListingPatterns.some((pattern) => pattern.test(listing.title || ''))
}

const Dashboard = () => {
  const { token } = useAuth()
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')

  const resolveImage = (listing) => {
    const firstImage = listing.images?.[0]

    if (!firstImage) {
      return fallbackImage
    }

    const imageName = decodeURIComponent(firstImage).split('/').pop().toLowerCase()
    return assetMap[imageName] || firstImage
  }

  const loadListings = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const headers = { Authorization: `Bearer ${token}` }
      const claimedResponse = await axios.post(`${API_URL}/api/accommodations/host/claim-featured`, {}, { headers })
      const nextListings = Array.isArray(claimedResponse.data) ? claimedResponse.data : []
      setListings(nextListings)
    } catch {
      try {
        const response = await axios.get(`${API_URL}/api/accommodations/host`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setListings(Array.isArray(response.data) ? response.data : [])
      } catch {
        try {
          const publicResponse = await axios.get(`${API_URL}/api/accommodations`)
          const featuredListings = Array.isArray(publicResponse.data)
            ? publicResponse.data.filter(isFeaturedHostListing)
            : []

          setListings(featuredListings)
          setError(featuredListings.length > 0 ? '' : 'Could not load listings')
        } catch {
          setError('Could not load listings')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteListing = async (listingId) => {
    setDeletingId(listingId)
    setError('')

    try {
      await axios.delete(`${API_URL}/api/accommodations/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
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
    loadListings()
  }, [token])

  return (
    <div className="admin_page">
      <AdminHeader />

      <nav className="admin_nav" aria-label="Admin navigation">
        <Link to="/admin/reservations">View Reservations</Link>
        <Link to="/admin/listings">View Listings</Link>
        <Link to="/admin/create">Create Listing</Link>
      </nav>

      <main className="admin_main">
        <h1>My Listings</h1>
        {error && <p className="admin_error">{error}</p>}
        {loading && <p className="admin_empty">Loading listings...</p>}

        <div className="admin_listing_stack">
          {listings.map((listing) => (
            <article className="admin_listing_card" key={listing._id}>
              <div className="admin_listing_media_column">
                <div className="admin_listing_media">
                  <img src={resolveImage(listing)} alt={listing.title} />
                </div>

                <Link className="admin_update_button" to={`/admin/update/${listing._id}`}>
                  Update
                </Link>
                <button
                  type="button"
                  className="admin_delete_button"
                  disabled={deletingId === listing._id}
                  onClick={() => deleteListing(listing._id)}
                >
                  {deletingId === listing._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              <div className="admin_listing_info">
                <p>{listing.type || 'Listing'}{listing.location ? ` - ${listing.location.split(',')[0]}` : ''}</p>
                <h2>{listing.title}</h2>
                <div className="admin_listing_line" />
                <span>
                  {listing.guests || 0} guests - {listing.type || 'Property'} - {listing.bedrooms || 0} bedroom{listing.bedrooms === 1 ? '' : 's'} - {listing.bathrooms || 0} bathroom{listing.bathrooms === 1 ? '' : 's'}
                </span>
                {listing.amenities?.length > 0 && (
                  <span>Amenities: {listing.amenities.slice(0, 3).join(', ')}</span>
                )}
                <span className="admin_listing_rating">
                  <span aria-hidden="true">★</span> {Number(listing.rating || 4.7).toFixed(1)} ({listing.reviews || 0} reviews)
                </span>
              </div>

              <strong className="admin_listing_price">${listing.price || 0}/night</strong>
            </article>
          ))}
        </div>

        {!loading && listings.length === 0 && !error && (
          <p className="admin_empty">No listings have been assigned to this host yet.</p>
        )}
      </main>
    </div>
  )
}

export default Dashboard
