import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import AdminHeader from '../../Components/AdminHeader'
import './Createlisting.css'

const UpdateListing = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    price: '0',
    bedrooms: '0',
    bathrooms: '0',
    guests: '0',
    type: '',
    weeklyDiscount: '0',
    cleaningFee: '0',
    serviceFee: '0',
    occupancyTaxes: '0',
    enhancedCleaning: false,
    selfCheckIn: false,
  })
  const [amenityInput, setAmenityInput] = useState('')
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getListing = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/accommodations/${id}`)
        const listing = response.data

        setFormData({
          title: listing.title || '',
          location: listing.location || '',
          description: listing.description || '',
          price: listing.price?.toString() || '0',
          bedrooms: listing.bedrooms?.toString() || '0',
          bathrooms: listing.bathrooms?.toString() || '0',
          guests: listing.guests?.toString() || '0',
          type: listing.type || '',
          weeklyDiscount: listing.weeklyDiscount?.toString() || '0',
          cleaningFee: listing.cleaningFee?.toString() || '0',
          serviceFee: listing.serviceFee?.toString() || '0',
          occupancyTaxes: listing.occupancyTaxes?.toString() || '0',
          enhancedCleaning: Boolean(listing.enhancedCleaning),
          selfCheckIn: Boolean(listing.selfCheckIn),
        })
        setAmenities(Array.isArray(listing.amenities) ? listing.amenities : [])
        setImages(Array.isArray(listing.images) ? listing.images : [])
      } catch {
        setError('Could not load listing details')
      } finally {
        setLoading(false)
      }
    }

    getListing()
  }, [id])

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const selectDefaultNumber = (event) => {
    if (event.target.value === '0') {
      event.target.select()
    }
  }

  const handleAddAmenity = () => {
    const amenity = amenityInput.trim()

    if (!amenity) {
      return
    }

    setAmenities([...amenities, amenity])
    setAmenityInput('')
  }

  const handleImageUpload = (event) => {
    setImages(Array.from(event.target.files))
  }

  const validateForm = () => {
    if (formData.title.trim().length < 3) {
      return 'Title must be at least 3 characters'
    }

    if (formData.description.trim().length < 10) {
      return 'Description must be at least 10 characters'
    }

    if (Number(formData.price) <= 0) {
      return 'Price must be more than 0'
    }

    if (Number(formData.guests) <= 0) {
      return 'Guests must be more than 0'
    }

    if (Number(formData.bedrooms) <= 0) {
      return 'Bedrooms must be more than 0'
    }

    if (Number(formData.bathrooms) <= 0) {
      return 'Bathrooms must be more than 0'
    }

    if (
      Number(formData.weeklyDiscount) < 0 ||
      Number(formData.cleaningFee) < 0 ||
      Number(formData.serviceFee) < 0 ||
      Number(formData.occupancyTaxes) < 0
    ) {
      return 'Fees and discount cannot be negative'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await axios.put(
        `http://localhost:5000/api/accommodations/${id}`,
        {
          ...formData,
          amenities,
          images: images.map((image) => image.name),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      navigate('/admin/listings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing')
    }
  }

  return (
    <div className="create_listing">
      <AdminHeader />

      <nav className="create_listing_nav" aria-label="Admin navigation">
        <Link to="/admin/listings">View Listings</Link>
      </nav>

      <main className="create_listing_content">
        <h1>Update Listing</h1>
        {error && <p className="create_listing_error">{error}</p>}

        {loading ? (
          <p>Loading listing...</p>
        ) : (
          <form className="create_listing_form" onSubmit={handleSubmit}>
            <section className="create_listing_left">
              <label>
                Listing Title
                <input name="title" value={formData.title} onChange={handleChange} required />
              </label>

              <label>
                Location
                <select name="location" value={formData.location} onChange={handleChange} required>
                  <option value="">Select a location</option>
                  <option value="Paris">Paris</option>
                  <option value="Rome">Rome</option>
                  <option value="New York">New York</option>
                  <option value="Tokyo">Tokyo</option>
                  <option value="Sydney">Sydney</option>
                  <option value="Cape Town">Cape Town</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Durban">Durban</option>
                  <option value="Pretoria">Pretoria</option>
                  <option value="Sandton">Sandton</option>
                </select>
              </label>

              <label>
                Description
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </label>

              <div className="create_listing_checks">
                <label>
                  <input
                    type="checkbox"
                    name="enhancedCleaning"
                    checked={formData.enhancedCleaning}
                    onChange={handleChange}
                  />
                  Enhanced Cleaning
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="selfCheckIn"
                    checked={formData.selfCheckIn}
                    onChange={handleChange}
                  />
                  Self Check-In
                </label>
              </div>

              <label>
                Amenities
                <div className="create_listing_amenities">
                  <input value={amenityInput} onChange={(event) => setAmenityInput(event.target.value)} />
                  <button type="button" onClick={handleAddAmenity}>
                    Add
                  </button>
                </div>
              </label>

              {amenities.length > 0 && (
                <div className="create_listing_tags">
                  {amenities.map((amenity, index) => (
                    <span key={`${amenity}-${index}`}>{amenity}</span>
                  ))}
                </div>
              )}
            </section>

            <section className="create_listing_right">
              <div className="create_listing_top_row">
                <label>
                  Price
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onFocus={selectDefaultNumber}
                    min="0"
                    step="1"
                    inputMode="numeric"
                    required
                  />
                </label>

                <label>
                  Type
                  <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="Entire home">Entire home</option>
                    <option value="Entire room">Entire room</option>
                    <option value="Entire apartment">Entire apartment</option>
                    <option value="Whole villa">Whole villa</option>
                    <option value="Private room">Private room</option>
                    <option value="Shared room">Shared room</option>
                  </select>
                </label>
              </div>

              <div className="create_listing_numbers">
                <label>
                  Guests
                  <input type="number" name="guests" value={formData.guests} onChange={handleChange} onFocus={selectDefaultNumber} min="1" required />
                </label>

                <label>
                  Bedrooms
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} onFocus={selectDefaultNumber} min="1" required />
                </label>

                <label>
                  Bathrooms
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} onFocus={selectDefaultNumber} min="1" required />
                </label>
              </div>

              <div className="create_listing_fees">
                <label>
                  Weekly Discount
                  <input type="number" name="weeklyDiscount" value={formData.weeklyDiscount} onChange={handleChange} onFocus={selectDefaultNumber} min="0" required />
                </label>

                <label>
                  Cleaning Fee
                  <input type="number" name="cleaningFee" value={formData.cleaningFee} onChange={handleChange} onFocus={selectDefaultNumber} min="0" required />
                </label>

                <label>
                  Service Fee
                  <input type="number" name="serviceFee" value={formData.serviceFee} onChange={handleChange} onFocus={selectDefaultNumber} min="0" required />
                </label>

                <label>
                  Occupancy Taxes
                  <input type="number" name="occupancyTaxes" value={formData.occupancyTaxes} onChange={handleChange} onFocus={selectDefaultNumber} min="0" required />
                </label>
              </div>

              <label className="create_listing_upload">
                <span>Upload Images</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              </label>

              <div className="create_listing_image_box">
                {images.length > 0 ? (
                  <span>{images.length} image{images.length === 1 ? '' : 's'} selected</span>
                ) : (
                  <span>No images uploaded</span>
                )}
              </div>

              <div className="create_listing_buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={() => navigate('/admin/listings')}>
                  Cancel
                </button>
              </div>
            </section>
          </form>
        )}
      </main>
    </div>
  )
}

export default UpdateListing
