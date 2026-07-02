import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LocationCard.css'
import SandtonImage from '../assets/Sandton.jpg'
import JohannesburgImage from '../assets/Johannesburg.jpg'
import HydeParkImage from '../assets/Hydepark placeholder.jpg'
import WoodmeadImage from '../assets/Woodmed.jpg'
import OneKingBedImage from '../assets/accommodation/1-KING-BED.avif'
import EndlessViewsImage from '../assets/accommodation/Endlessviews.avif'
import EndlessViewsOneImage from '../assets/accommodation/EndlessViews.1.avif'
import EndlessViewsOneBedroomImage from '../assets/accommodation/EndlessViews.1Bedroom.avif'
import EndlessViewsTwoImage from '../assets/accommodation/EndlessViews.2.avif'
import EndlessViewsThreeImage from '../assets/accommodation/EndlessViews.3.avif'
import EndlessViewsFourImage from '../assets/accommodation/EndlessViews.4.avif'
import EndlessViewsFiveImage from '../assets/accommodation/EndlessViews.5.avif'
import EruCapeTownImage from '../assets/accommodation/ERU-Cape Town.avif'
import EruCapeTownOneImage from '../assets/accommodation/ERU-Cape Town-1.avif'
import EruCapeTownTwoImage from '../assets/accommodation/ERU-Cape Town-2.avif'
import EruCapeTownThreeImage from '../assets/accommodation/ERU-Cape Town-3.avif'
import EruCapeTownFourImage from '../assets/accommodation/ERU-Cape Town-4.avif'
import RoomImage from '../assets/accommodation/Room.avif'
import RoomOneImage from '../assets/accommodation/Room.1.avif'
import RoomTwoImage from '../assets/accommodation/Room.2.avif'
import RoomThreeImage from '../assets/accommodation/Room.3.avif'
import SeapointOneImage from '../assets/accommodation/Seapoint-1.avif'
import SeapointTwoImage from '../assets/accommodation/Seapoint-2.avif'
import SeapointThreeImage from '../assets/accommodation/Seapoint-3.avif'
import SeapointFourImage from '../assets/accommodation/Seapoint-4.avif'
import SeapointFiveImage from '../assets/accommodation/Seapoint-5.avif'
import TablemountainImage from '../assets/accommodation/Tablemountain.avif'
import TablemountainOneImage from '../assets/accommodation/Tablemountain.1.avif'
import TablemountainTwoImage from '../assets/accommodation/Tablemountain.2.avif'
import TablemountainThreeImage from '../assets/accommodation/Tablemountain.3.avif'
import TablemountainFourImage from '../assets/accommodation/Tablemountain.4.avif'
import TablemountainFiveImage from '../assets/accommodation/Tablemountain.5.avif'

const imageMap = {
  'Sandton.jpg': SandtonImage,
  'Sandton.avif': SandtonImage,
  'Sandton.1.avif': SandtonImage,
  'Sandton.2.avif': SandtonImage,
  'Sandton.3.avif': SandtonImage,
  'Sandton.4.avif': SandtonImage,
  'Sandton.5.avif': SandtonImage,
  'Johannesburg.jpg': JohannesburgImage,
  'Hydepark placeholder.jpg': HydeParkImage,
  'Woodmed.jpg': WoodmeadImage,
  '1-KING-BED.avif': OneKingBedImage,
  'Endlessview.avif': EndlessViewsImage,
  'Endlessview.1.avif': EndlessViewsOneImage,
  'Endlessview.2.avif': EndlessViewsTwoImage,
  'Endlessview.3.avif': EndlessViewsThreeImage,
  'Endlessview.4.avif': EndlessViewsFourImage,
  'Endlessview.5.avif': EndlessViewsFiveImage,
  'Endlessviews.avif': EndlessViewsImage,
  'EndlessViews.1.avif': EndlessViewsOneImage,
  'EndlessViews.1Bedroom.avif': EndlessViewsOneBedroomImage,
  'EndlessViews.2.avif': EndlessViewsTwoImage,
  'EndlessViews.3.avif': EndlessViewsThreeImage,
  'EndlessViews.4.avif': EndlessViewsFourImage,
  'EndlessViews.5.avif': EndlessViewsFiveImage,
  'ERU-Cape Town.avif': EruCapeTownImage,
  'ERU-Cape Town-1.avif': EruCapeTownOneImage,
  'ERU-Cape Town-2.avif': EruCapeTownTwoImage,
  'ERU-Cape Town-3.avif': EruCapeTownThreeImage,
  'ERU-Cape Town-4.avif': EruCapeTownFourImage,
  'Room.avif': RoomImage,
  'Room.1.avif': RoomOneImage,
  'Room.2.avif': RoomTwoImage,
  'Room.3.avif': RoomThreeImage,
  'Seapoint-1.avif': SeapointOneImage,
  'Seapoint-2.avif': SeapointTwoImage,
  'Seapoint-3.avif': SeapointThreeImage,
  'Seapoint-4.avif': SeapointFourImage,
  'Seapoint-5.avif': SeapointFiveImage,
  'Tablemountain.avif': TablemountainImage,
  'Tablemountain.1.avif': TablemountainOneImage,
  'Tablemountain.2.avif': TablemountainTwoImage,
  'Tablemountain.3.avif': TablemountainThreeImage,
  'Tablemountain.4.avif': TablemountainFourImage,
  'Tablemountain.5.avif': TablemountainFiveImage,
}

const fallbackImages = [
  EndlessViewsImage,
  EruCapeTownImage,
  RoomImage,
  SeapointOneImage,
  TablemountainImage,
]

const getListingImage = (listing) => {
  const firstImage = listing.images?.[0]

  if (firstImage) {
    const imageName = decodeURIComponent(firstImage).split('/').pop()
    const mappedImage = imageMap[firstImage] || imageMap[imageName] || firstImage
    if (mappedImage && mappedImage !== firstImage) {
      return mappedImage
    }
  }

  // Use a consistent fallback based on listing title or location
  const hash = (listing.title || listing.location || '').charCodeAt(0) || 0
  return fallbackImages[hash % fallbackImages.length]
}

const LocationCard = ({ listing }) => {
  const navigate = useNavigate()
  const imageUrl = getListingImage(listing)
  const amenities = listing.amenities || []
  const title = listing.title || listing.location
  const locationName = listing.location?.split(',')[0] || 'your selected location'
  const type = listing.type || 'Entire apartment'
  const rating = listing.rating || 4.5
  const reviews = Array.isArray(listing.reviews) ? listing.reviews.length : listing.reviews || 0
  const guests = listing.guests || 1
  const bedrooms = listing.bedrooms || 1
  const bathrooms = listing.bathrooms || 1
  const price = listing.price || 0

  return (
    <article
      className="location_result_card"
      onClick={() => navigate(`/listing/${listing._id}`)}
    >
      <div className="location_result_image">
        <img src={imageUrl} alt={title} loading="lazy" />
      </div>

      <div className="location_result_details">
        <p className="location_result_type">{type}</p>
        <h2>{locationName}</h2>
        <div className="location_result_line" />
        <p>{guests} guests - {type} - {bedrooms} bedroom{bedrooms === 1 ? '' : 's'} - {bathrooms} bathroom{bathrooms === 1 ? '' : 's'}</p>
        {amenities.length > 0 && (
          <p>{amenities.slice(0, 3).join(' - ')}</p>
        )}

        <div className="location_result_rating">
          <span className="location_result_star" aria-hidden="true" />
          <strong>{Number(rating).toFixed(1)}</strong>
          <span>({reviews} reviews)</span>
        </div>
      </div>

      <div className="location_result_side">
        <button
          type="button"
          className="location_result_favorite"
          aria-label={`Save ${title}`}
          onClick={(event) => event.stopPropagation()}
        />

        <p className="location_result_price">
          <strong>${price}</strong>
          <span>/ night</span>
        </p>
      </div>
    </article>
  )
}

export default LocationCard
