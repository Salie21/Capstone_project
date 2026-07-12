import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../Components/Footer.jsx";
import { useAuth } from "../../context/useAuth";
import "./ListingDetails.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import DoorBackOutlinedIcon from '@mui/icons-material/DoorBackOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Badge from "../../assets/Badge.svg";
import API_URL from "../../utils/api";

const assetModules = import.meta.glob("../../assets/**/*.{jpg,jpeg,png,avif,webp}", {
  eager: true,
  import: "default",
});
const assetMap = Object.fromEntries(
  Object.entries(assetModules).map(([path, src]) => [
    decodeURIComponent(path.split("/").pop()).toLowerCase(),
    src,
  ])
);
const fallbackImages = [
  assetMap["endlessviews.avif"],
  assetMap["eru-cape town.avif"],
  assetMap["room.avif"],
  assetMap["seapoint-1.avif"],
  assetMap["tablemountain.avif"],
].filter(Boolean);

const sampleReviews = [
  { name: "Jose", date: "December 2023", text: "This was a lovely stay, quiet, clean, and close to everything we needed." },
  { name: "Litha", date: "November 2023", text: "Communication was great and the apartment felt exactly like the photos." },
  { name: "Shanya", date: "January 2024", text: "Wonderful place with comfortable rooms and a helpful host." },
  { name: "Josh", date: "September 2023", text: "A solid stay for a quick trip. Check-in was simple and the area was convenient." },
];

const sampleListings = [
  {
    _id: "preview-cape-town",
    title: "Ocean-view apartment in Cape Town",
    location: "Cape Town, South Africa",
    type: "Entire rental unit",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Wifi", "Kitchen", "Free parking", "TV", "Air conditioning", "Dedicated workspace"],
    rating: 4.9,
    reviews: 28,
    price: 180,
    weeklyDiscount: 45,
    cleaningFee: 40,
    serviceFee: 35,
    occupancyTaxes: 25,
    description: "Bright, modern apartment with panoramic views, a private balcony, and walkable access to cafes, beaches, and local attractions.",
    host: { username: "Ava", name: "Ava" },
    images: ["/src/assets/accommodation/ERU-Cape Town.avif"],
  },
  {
    _id: "preview-sandton",
    title: "Stylish city stay in Sandton",
    location: "Sandton, South Africa",
    type: "Entire condo",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Wifi", "Pool", "Gym", "Self check-in", "Washer", "Kitchen"],
    rating: 4.8,
    reviews: 14,
    price: 150,
    weeklyDiscount: 30,
    cleaningFee: 25,
    serviceFee: 30,
    occupancyTaxes: 20,
    description: "A polished urban retreat in a secure complex with skyline views, fast Wi-Fi, and close proximity to restaurants and business hubs.",
    host: { username: "Mina", name: "Mina" },
    images: ["/src/assets/Sandton.jpg"],
  },
  {
    _id: "preview-seapoint",
    title: "Seaside escape near the promenade",
    location: "Sea Point, South Africa",
    type: "Private room",
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Wifi", "Beach access", "Breakfast", "Free parking", "Workspace"],
    rating: 4.7,
    reviews: 11,
    price: 110,
    weeklyDiscount: 20,
    cleaningFee: 20,
    serviceFee: 25,
    occupancyTaxes: 15,
    description: "A calm coastal stay with a sunny terrace and easy access to scenic walks, restaurants, and the waterfront.",
    host: { username: "Liam", name: "Liam" },
    images: ["/src/assets/accommodation/Seapoint-1.avif"],
  },
];

const getFallbackListing = (id) => {
  if (!id) {
    return sampleListings[0];
  }

  return sampleListings.find((listing) => listing._id === id) || sampleListings[0];
};

const todayInput = () => new Date().toISOString().slice(0, 10);

const addDays = (dateValue, days) => {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Select date";
  }

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getNightCount = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const nights = Math.round((end - start) / 86400000);

  return nights > 0 ? nights : 0;
};

const buildCalendarMonth = (monthDate, checkIn, checkOut) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const value = new Date(year, month, day).toISOString().slice(0, 10);
    const isSelected = value === checkIn || value === checkOut;
    const isInRange = checkIn && checkOut && value > checkIn && value < checkOut;

    days.push({ day, value, isSelected, isInRange });
  }

  return {
    label: monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    days,
  };
};

const resolveImage = (src) => {
  if (!src) {
    return "";
  }

  const imageName = decodeURIComponent(src).split("/").pop();
  const matchedAsset = assetMap[imageName.toLowerCase()];

  if (matchedAsset) {
    return matchedAsset;
  }

  if (/^(https?:|data:|blob:)/i.test(src)) {
    return src;
  }

  return "";
};

const getHostName = (host) => {
  if (!host) {
    return "Ghazal";
  }

  if (typeof host === "string") {
    return host;
  }

  return host.username || host.name || "Ghazal";
};

const getReviewCount = (reviews) => {
  if (Array.isArray(reviews)) {
    return reviews.length;
  }

  return Number(reviews) || 0;
};

const getSpecificRatingRows = (specificRatings, rating) => {
  const fallbackRating = Number(rating) || 4.5;
  const labels = [
    ["Cleanliness", "cleanliness"],
    ["Accuracy", "accuracy"],
    ["Communication", "communication"],
    ["Location", "location"],
    ["Check-in", "checkIn"],
    ["Value", "value"],
  ];

  return labels.map(([label, key]) => [
    label,
    Number(specificRatings?.[key]) || fallbackRating,
  ]);
};

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/api/accommodations/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
        setSelectedGuests(Number(data.guests) || 1);
        setError(null);
      } catch (err) {
        const fallbackListing = getFallbackListing(id);
        setListing(fallbackListing);
        setSelectedGuests(Number(fallbackListing?.guests) || 1);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const displayImages = useMemo(() => {
    const resolvedImages = (listing?.images || []).map(resolveImage).filter(Boolean);
    return [...resolvedImages, ...fallbackImages].slice(0, 5);
  }, [listing]);

  const currentMonth = useMemo(() => {
    return displayMonth;
  }, [displayMonth]);

  if (loading) return <div className="listing-status">Loading listing...</div>;
  if (!listing) return null;

  const {
    type = "Entire rental unit",
    location = "New York",
    guests = 1,
    bedrooms = 1,
    bathrooms = 1,
    amenities = [],
    price = 0,
    title = "Beautiful getaway",
    host,
    rating = 4.5,
    reviews = 0,
    specificRatings,
    weeklyDiscount = 0,
    cleaningFee = 0,
    serviceFee = 0,
    occupancyTaxes = 0,
    description = "Come and stay in this beautiful home close to restaurants, shops, and local attractions.",
  } = listing;

  const hostName = getHostName(host);
  const displayRating = Number(rating) || 4.5;
  const displayReviewCount = getReviewCount(reviews);
  const displayLocation = location || "New York";
  const locationName = displayLocation.split(",")[0] || displayLocation;
  const regionName = displayLocation.split(",").slice(1).join(",").trim() || displayLocation;
  const displayRatingRows = getSpecificRatingRows(specificRatings, displayRating);
  const nights = getNightCount(checkInDate, checkOutDate);
  const subtotal = price * nights;
  const total = subtotal - weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes;
  const reservationTotal = Math.max(total, 0);
  const firstCalendar = buildCalendarMonth(currentMonth, checkInDate, checkOutDate);
  const secondCalendar = buildCalendarMonth(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    checkInDate,
    checkOutDate
  );
  const shownAmenities = amenities.length
    ? amenities
    : ["Wifi", "Kitchen", "Free parking", "TV", "Air conditioning", "Dedicated workspace", "Washer", "Private entrance"];

  return (
      <main className="listing-page">
        {error && <p className="listing-status listing-status-error">{error}</p>}
      <section className="listing-container">
        <div className="listing-title-row">
          <div>
            <h1>{title}</h1>
            <div className="listing-subtitle">
              <span className="rating-mark">
                <GradeRoundedIcon />
                {displayRating.toFixed(1)}
              </span>
              <span className="listing-subtitle-link">({displayReviewCount} reviews)</span>
              <span className="listing-subtitle-link">{displayLocation}</span>
            </div>
          </div>
          <div className="listing-actions">
                <ShareOutlinedIcon/>
            <button className="link-btn" type="button">Share</button>
            <button className="link-btn" type="button">
              <FavoriteBorderOutlinedIcon />
            </button>
            <p>Save</p>
          </div>
        </div>

        <div className="gallery-grid">
          <img className="gallery-main" src={displayImages[0]} alt={title} />
          {displayImages.slice(1, 5).map((src, index) => (
            <img key={src + index} src={src} alt={`${title} ${index + 2}`} />
          ))}
        </div>

        <div className="listing-body">
          <div className="listing-main">
            <section className="host-row">
              <div>
                <h2>{type} hosted by {hostName}</h2>
                <p className="quick-facts">
                  {guests} guests - {bedrooms} bedroom{bedrooms !== 1 ? "s" : ""} - {bathrooms} bathroom{bathrooms !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="host-avatar-wrap">
                <div className="host-avatar">{hostName.charAt(0)}</div>
                <div className="host-badge-wrap">
                  <img className="host-badge" src={Badge} alt="Verified host badge" />
                </div>
              </div>
            </section>

            <section className="feature-list">
              <div className="feature-item">
                <HomeOutlinedIcon/>
                <strong>{type}</strong>
                <span>You will have the accommodation to yourself.</span>
              </div>
              <div className="feature-item">
                <AutoAwesomeOutlinedIcon />
                <strong>Enhanced clean</strong>
                <span>This host follows an enhanced cleaning process.</span>
              </div>
              <div className="feature-item">
                <DoorBackOutlinedIcon/>
                <strong>Self check-in</strong>
                <span>Check yourself in with a lockbox.</span>
              </div>
              <div className="feature-item">
                <CalendarTodayOutlinedIcon/>
                <strong>Free cancellation available</strong>
              </div>
            </section>

            <section className="listing-section">
              <p className="description">{description}</p>
              <button className="text-link" type="button">Show more</button>
            </section>

            <section className="listing-section">
              <h3>Where you'll sleep</h3>
              <div className="sleep-card">
                <img src={displayImages[1] || displayImages[0]} alt="Bedroom" />
                <strong>Bedroom</strong>
                <span>{bedrooms} bedroom{bedrooms === 1 ? "" : "s"}</span>
              </div>
            </section>

            <section className="listing-section">
              <h3>What this place offers</h3>
              <div className="amenities-grid">
                {shownAmenities.slice(0, 10).map((amenity) => (
                  <div className="amenity" key={amenity}>
                    <span className="amenity-icon">+</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              <button className="outline-btn" type="button">Show all amenities</button>
            </section>

            <section className="listing-section">
              <h3>{nights} night{nights === 1 ? "" : "s"} in {locationName}</h3>
              <p className="muted">{formatDate(checkInDate)} - {formatDate(checkOutDate)}</p>
              <div className="calendar-grid">
                {[firstCalendar, secondCalendar].map((month) => (
                  <div className="calendar-month" key={month.label}>
                    <strong>{month.label}</strong>
                    <div className="calendar-days">
                      {["S", "M", "T", "W", "T", "F", "S"].map((dayLabel, index) => (
                        <span className="calendar-weekday" key={`${month.label}-${dayLabel}-${index}`}>{dayLabel}</span>
                      ))}
                      {month.days.map((day, index) => (
                        day ? (
                          <button
                            type="button"
                            className={`calendar-day ${day.isSelected ? "calendar-selected" : ""} ${day.isInRange ? "calendar-range" : ""}`}
                            key={day.value}
                            onClick={() => {
                              // If clicking on check-in date, deselect both
                              if (day.value === checkInDate) {
                                setCheckInDate("");
                                setCheckOutDate("");
                              } 
                              // If clicking on check-out date, deselect only check-out
                              else if (day.value === checkOutDate) {
                                setCheckOutDate("");
                              } 
                              // Normal flow for unselected dates
                              else if (!checkInDate) {
                                setCheckInDate(day.value);
                                setDisplayMonth(new Date(`${day.value}T00:00:00`));
                              } else if (!checkOutDate) {
                                if (day.value > checkInDate) {
                                  setCheckOutDate(day.value);
                                } else if (day.value < checkInDate) {
                                  setCheckInDate(day.value);
                                  setCheckOutDate("");
                                  setDisplayMonth(new Date(`${day.value}T00:00:00`));
                                }
                              } else {
                                setCheckInDate(day.value);
                                setCheckOutDate("");
                                setDisplayMonth(new Date(`${day.value}T00:00:00`));
                              }
                            }}
                          >
                            {day.day}
                          </button>
                        ) : (
                          <span key={`${month.label}-blank-${index}`} />
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="listing-section">
              <h3> <GradeRoundedIcon/>{displayRating.toFixed(1)} - {displayReviewCount} reviews</h3>
              <div className="ratings-bars">
                {displayRatingRows.map(([label, value]) => (
                  <div className="rating-bar-row" key={label}>
                    <span>{label}</span>
                    <div className="rating-bar-track">
                      <div className="rating-bar-fill" style={{ width: `${(value / 5) * 100}%` }} />
                    </div>
                    <span>{value.toFixed(1)}</span>
                  </div>
                ))}
              </div>

              <div className="reviews-grid">
                {sampleReviews.map((review) => (
                  <article className="review-card" key={review.name}>
                    <div className="review-avatar">{review.name.charAt(0)}</div>
                    <div>
                      <p className="review-name">{review.name}</p>
                      <p className="review-date">{review.date}</p>
                      <p className="review-text">{review.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button className="outline-btn" type="button">Show all {displayReviewCount} reviews</button>
            </section>

            <section className="listing-section host-profile">
              <div className="host-avatar-wrap host-avatar-wrap-large">
                <div className="host-avatar large">{hostName.charAt(0)}</div>
                <div className="host-badge-wrap host-badge-wrap-large">
                  <img className="host-badge" src={Badge} alt="Verified host badge" />
                </div>
              </div>
              <div>
                <h3>Hosted by {hostName}</h3>
                <p className="muted">Joined in May 2021</p>
                <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
                <button className="outline-btn" type="button">Contact Host</button>
              </div>
            </section>

            <section className="listing-section things-section">
              <h3>Things to know</h3>
              <div className="things-grid">
                <div>
                  <h4>House rules</h4>
                  <p>Check-in after 4:00 PM</p>
                  <p>Checkout before 10:00 AM</p>
                  <p>No smoking</p>
                </div>
                <div>
                  <h4>Health & safety</h4>
                  <p>Committed to enhanced cleaning.</p>
                  <p>Smoke alarm installed.</p>
                  <p>Carbon monoxide alarm installed.</p>
                </div>
                <div>
                  <h4>Cancellation policy</h4>
                  <p>Free cancellation for 48 hours.</p>
                </div>
              </div>
            </section>
          </div>


          <aside className="booking-card">
            <div className="booking-card-header">
              <span className="booking-price">${price}<small> / night</small></span>
              <span className="booking-rating">* {displayRating.toFixed(1)} - {displayReviewCount} reviews</span>
            </div>

            <div className="booking-dates">
              <label>
                CHECK-IN
                <input
                  type="date"
                  min={todayInput()}
                  value={checkInDate}
                  onChange={(event) => {
                    const nextCheckIn = event.target.value;
                    setCheckInDate(nextCheckIn);
                    if (checkOutDate && nextCheckIn >= checkOutDate) {
                      setCheckOutDate(addDays(nextCheckIn, 1));
                    }
                  }}
                />
              </label>
              <label>
                CHECKOUT
                <input
                  type="date"
                  min={checkInDate ? addDays(checkInDate, 1) : todayInput()}
                  value={checkOutDate}
                  onChange={(event) => setCheckOutDate(event.target.value)}
                />
              </label>
            </div>
            <label className="guest-box">
              GUESTS
              <select value={selectedGuests} onChange={(event) => setSelectedGuests(Number(event.target.value))}>
                {Array.from({ length: guests || 1 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </label>

            <button
              className="reserve-btn"
              type="button"
              onClick={async () => {
                if (!token || !user) {
                  navigate('/login');
                  return;
                }

                if (!checkInDate || !checkOutDate) {
                  setBookingMessage('Please choose check-in and check-out dates first.');
                  return;
                }

                try {
                  const response = await fetch(`${API_URL}/api/reservations`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      bookedBy: user.username || user.name || 'Guest',
                      property: locationName || title,
                      checkin: checkInDate,
                      checkout: checkOutDate,
                      guests: selectedGuests,
                      totalPrice: reservationTotal,
                      accommodation: id,
                      host,
                    }),
                  });

                  if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Reservation could not be created.');
                  }

                  setBookingMessage('Reservation created successfully.');
                  navigate('/admin/reservations');
                } catch (err) {
                  setBookingMessage(err.message || 'Reservation could not be created.');
                }
              }}
            >
              Reserve
            </button>
            <p className="reserve-note">You won't be charged yet</p>
            {bookingMessage && <p className="reserve-note">{bookingMessage}</p>}

            <div className="cost-breakdown">
              <div className="cost-row">
                <span>${price} x {nights} night{nights === 1 ? "" : "s"}</span>
                <span>${subtotal}</span>
              </div>
              {weeklyDiscount > 0 && (
                <div className="cost-row discount">
                  <span>Weekly discount</span>
                  <span>-${weeklyDiscount}</span>
                </div>
              )}
              <div className="cost-row">
                <span>Cleaning fee</span>
                <span>${cleaningFee}</span>
              </div>
              <div className="cost-row">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="cost-row">
                <span>Occupancy taxes and fees</span>
                <span>${occupancyTaxes}</span>
              </div>
              <div className="cost-row total">
                <span>Total</span>
                <span>${reservationTotal}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="explore-options">
        <div className="explore-options-inner">
          <h2>Explore other options in {regionName}</h2>

          <div className="explore-city-grid">
            {[
              ["Paris", "Lille", "Toulouse"],
              ["Nice", "Aix-en-Provence", "Montpellier"],
              ["Lyon", "Rouen", "Dijon"],
              ["Marseille", "Amiens", "Grenoble"],
            ].map((column, index) => (
              <div className="explore-column" key={`city-${index}`}>
                {column.map((item) => (
                  <a href="#" key={item}>{item}</a>
                ))}
              </div>
            ))}
          </div>

          <h3>Unique stays on Airbnb</h3>
          <div className="explore-city-grid explore-stays-grid">
            {[
              ["Beach House Rentals", "Cabin Rentals"],
              ["Camper Rentals", "Tiny House Rentals"],
              ["Glamping Rentals", "Lakehouse Rentals"],
              ["Treehouse Rentals", "Mountain Chalet Rentals"],
            ].map((column, index) => (
              <div className="explore-column" key={`stay-${index}`}>
                {column.map((item) => (
                  <a href="#" key={item}>{item}</a>
                ))}
              </div>
            ))}
          </div>

          <nav className="explore-breadcrumbs" aria-label="Location breadcrumbs">
            <a href="#">Airbnb</a>
            <span>›</span>
            <a href="#">Europe</a>
            <span>›</span>
            <a href="#">France</a>
            <span>›</span>
            <a href="#">Bordeaux</a>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ListingDetails;
