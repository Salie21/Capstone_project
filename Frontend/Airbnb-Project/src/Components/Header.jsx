import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import './Header.css'
import logo from '../assets/airbnb.svg'
import whiteLogo from '../assets/airbnb-white.svg'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useAuth } from '../context/AuthContext'

const GuestsPopup = ({ adults, childrenCount, addGuest, removeGuest }) => {
  return (
    <div className="guests_popup">
      <div className="guest_row">
        <div>
          <h4>Adults</h4>
        </div>

        <div className="guest_controls">
          <button type="button" onClick={() => removeGuest('adults')}>-</button>
          <span>{adults}</span>
          <button type="button" onClick={() => addGuest('adults')}>+</button>
        </div>
      </div>

      <div className="guest_row">
        <div>
          <h4>Children</h4>
        </div>

        <div className="guest_controls">
          <button type="button" onClick={() => removeGuest('children')}>-</button>
          <span>{childrenCount}</span>
          <button type="button" onClick={() => addGuest('children')}>+</button>
        </div>
      </div>
    </div>
  )
}

const formatDate = (date) => {
  if (!date) {
    return 'Add dates'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const formatDateRange = (checkInDate, checkOutDate) => {
  if (checkInDate && checkOutDate) {
    return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`
  }

  if (checkInDate) {
    return `${formatDate(checkInDate)} - Add dates`
  }

  return 'Add dates'
}

const parseDateParam = (value) => {
  if (!value) {
    return null
  }

  const date = new Date(`${value}T00:00:00`)

  return Number.isNaN(date.getTime()) ? null : date
}

  const formatDateParam = (date) => {
  if (!date) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const isSameDay = (firstDate, secondDate) => {
  if (!firstDate || !secondDate) {
    return false
  }

  return firstDate.toDateString() === secondDate.toDateString()
}

const DatesPopup = ({ monthDate, checkInDate, checkOutDate, activeDateField, onSelectDate, onPrevMonth, onNextMonth }) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const monthName = monthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  const isInRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) {
      return false
    }

    return date > checkInDate && date < checkOutDate
  }

  const isDisabled = (date) => {
    if (activeDateField !== 'checkout' || !checkInDate) {
      return false
    }

    return date <= checkInDate && !isSameDay(date, checkInDate) && !isSameDay(date, checkOutDate)
  }

  const getDateClassName = (date) => {
    const classes = []

    if (isSameDay(date, checkInDate) || isSameDay(date, checkOutDate)) {
      classes.push('date_selected')
    }

    if (isSameDay(date, checkInDate)) {
      classes.push('date_checkin')
    }

    if (isSameDay(date, checkOutDate)) {
      classes.push('date_checkout')
    }

    if (isInRange(date)) {
      classes.push('date_in_range')
    }

    return classes.join(' ')
  }

  return (
    <div className="dates_popup">
      <div className="dates_popup_header">
        <button type="button" onClick={onPrevMonth}>‹</button>
        <h3>{monthName}</h3>
        <button type="button" onClick={onNextMonth}>›</button>
      </div>

      <div className="dates_weekdays">
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>

      <div className="dates_days">
        {days.map((date, index) => (
          date ? (
            <button
              type="button"
              key={date.toDateString()}
              className={getDateClassName(date)}
              disabled={isDisabled(date)}
              onClick={() => onSelectDate(date)}
            >
              {date.getDate()}
            </button>
          ) : (
            <span key={`blank-${index}`} />
          )
        ))}
      </div>
    </div>
  )
}

const Header = ({ logoType = 'default', variant = 'default', locations = [], hideSearch = false, compactSearch = false })=>  {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const currentLocation = useLocation()
  const [searchParams] = useSearchParams()
  const locationFromUrl = searchParams.get('location') || ''
  const checkInFromUrl = searchParams.get('checkIn')
  const checkOutFromUrl = searchParams.get('checkOut')
  const adultsFromUrl = searchParams.get('adults')
  const childrenFromUrl = searchParams.get('children')
  const uniqueLocations = useMemo(() => {
    return [...new Set(locations.filter((location) => location && location !== 'All locations'))]
  }, [locations])
  const matchingLocation = uniqueLocations.find((location) => location.split(',')[0] === locationFromUrl)
  const [selectedLocation, setSelectedLocation] = useState(matchingLocation || '')
  const [locationWasCleared, setLocationWasCleared] = useState(false)
  const [showGuests, setShowGuests] = useState(false)
  const [showLocations, setShowLocations] = useState(false)
  const [showDates, setShowDates] = useState(false)
  const [activeDateField, setActiveDateField] = useState('')
  const [checkInDate, setCheckInDate] = useState(parseDateParam(checkInFromUrl))
  const [checkOutDate, setCheckOutDate] = useState(parseDateParam(checkOutFromUrl))
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [adults, setAdults] = useState(Number(adultsFromUrl) || 0)
  const [children, setChildren] = useState(Number(childrenFromUrl) || 0)
  const selectedLogo = logoType === 'white' ? whiteLogo : logo
  const isHomeHeader = variant === 'home'
  const isResultsHeader = currentLocation.pathname === '/locations'
  const totalGuests = adults + children
  const selectedLocationLabel = selectedLocation
    ? selectedLocation.split(',')[0]
    : locationWasCleared
      ? 'Where are you going?'
    : locationFromUrl || 'Where are you going?'
  const compactLocationLabel = selectedLocation
    ? selectedLocation.split(',')[0]
    : locationWasCleared
      ? 'Where are you going?'
    : locationFromUrl || 'Where are you going?'
  const guestLabel = totalGuests === 0 ? 'Add guests' : `${totalGuests} guest${totalGuests === 1 ? '' : 's'}`
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [compactLocationInput, setCompactLocationInput] = useState(locationFromUrl)
  const checkInRef = useRef(null)
  const checkOutRef = useRef(null)
  const guestsRef = useRef(null)
  const profileRef = useRef(null)
  const locationRef = useRef(null)

  const handleLogoClick = (event) => {
    const isHomeRoute = currentLocation.pathname === '/' || currentLocation.pathname === '/home'

    if (isHomeRoute) {
      event.preventDefault()
      window.location.reload()
    }
  }

  useEffect(() => {
    setSelectedLocation(matchingLocation || '')
    setCheckInDate(parseDateParam(checkInFromUrl))
    setCheckOutDate(parseDateParam(checkOutFromUrl))
    setAdults(Number(adultsFromUrl) || 0)
    setChildren(Number(childrenFromUrl) || 0)
    setLocationWasCleared(false)
    if (compactSearch) {
      setCompactLocationInput(locationFromUrl)
    }
  }, [matchingLocation, checkInFromUrl, checkOutFromUrl, adultsFromUrl, childrenFromUrl, compactSearch, locationFromUrl])

  useEffect(() => {
    const closeDropdowns = (event) => {
      const clickedCheckIn = checkInRef.current?.contains(event.target)
      const clickedCheckOut = checkOutRef.current?.contains(event.target)
      const clickedGuests = guestsRef.current?.contains(event.target)
      const clickedProfile = profileRef.current?.contains(event.target)
      const clickedLocation = locationRef.current?.contains(event.target)

      if (!clickedCheckIn && !clickedCheckOut) {
        setShowDates(false)
      }

      if (!clickedGuests) {
        setShowGuests(false)
      }

      if (!clickedLocation) {
        setShowLocations(false)
      }

      if (!clickedProfile) {
        setShowProfileMenu(false)
      }
    }

    const closeDropdownsOnEscape = (event) => {
      if (event.key !== 'Escape') {
        return
      }

      setShowDates(false)
      setShowGuests(false)
      setShowLocations(false)
      setShowProfileMenu(false)
    }

    document.addEventListener('mousedown', closeDropdowns)
    document.addEventListener('keydown', closeDropdownsOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeDropdowns)
      document.removeEventListener('keydown', closeDropdownsOnEscape)
    }
  }, [])

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
    setLocationWasCleared(!location)
    setShowLocations(false)
  }

  const handleAllLocations = () => {
    setSelectedLocation('')
    setLocationWasCleared(true)
    setShowLocations(false)
    setShowDates(false)
    setShowGuests(false)
    navigate('/locations')
  }

  const addGuest = (guestType) => {
    if (guestType === 'adults') {
      setAdults(adults + 1)
    } else {
      setChildren(children + 1)
    }
  }

  const removeGuest = (guestType) => {
    if (guestType === 'adults' && adults > 0) {
      setAdults(adults - 1)
    }

    if (guestType === 'children' && children > 0) {
      setChildren(children - 1)
    }
  }

  const openCalendar = (field) => {
    setActiveDateField(field)
    setShowDates(true)
    setShowLocations(false)
    setShowGuests(false)
    setShowProfileMenu(false)
  }

  const selectDate = (date) => {
    if (isSameDay(date, checkInDate)) {
      setCheckInDate(null)
      setCheckOutDate(null)
      setShowDates(false)
      setActiveDateField('')
      return
    }

    if (isSameDay(date, checkOutDate)) {
      setCheckOutDate(null)
      setShowDates(false)
      setActiveDateField('')
      return
    }

    if (activeDateField === 'checkin') {
      setCheckInDate(date)
      if (checkOutDate && checkOutDate <= date) {
        setCheckOutDate(null)
      }
      setActiveDateField('checkout')
      return
    }

    if (activeDateField === 'checkout') {
      if (!checkInDate) {
        setCheckInDate(date)
        setActiveDateField('checkout')
        return
      }

      if (date <= checkInDate) {
        return
      }

      setCheckOutDate(date)
      setShowDates(false)
      setActiveDateField('')
    }
  }

  const goToPreviousMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
  }

  const handleSearch = (event) => {
    if (event?.preventDefault) {
      event.preventDefault()
    }

    const params = new URLSearchParams()
    const locationForSearch = compactSearch
      ? compactLocationInput.trim()
      : selectedLocation
        ? selectedLocation.split(',')[0]
        : locationWasCleared
          ? ''
          : locationFromUrl

    if (locationForSearch) {
      params.set('location', locationForSearch)
    }

    if (!compactSearch) {
      if (checkInDate) {
        params.set('checkIn', formatDateParam(checkInDate))
      }

      if (checkOutDate) {
        params.set('checkOut', formatDateParam(checkOutDate))
      }

      if (adults > 0) {
        params.set('adults', String(adults))
      }

      if (children > 0) {
        params.set('children', String(children))
      }
    }

    setShowDates(false)
    setShowGuests(false)
    setShowLocations(false)
    navigate(`/locations${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    navigate('/login')
  }

  const compactSearchForm = (
    <form className="header_search_compact_form" onSubmit={handleSearch}>
      <input
        type="text"
        value={compactLocationInput}
        onChange={(event) => setCompactLocationInput(event.target.value)}
        placeholder="Start your search"
        className="header_compact_search_input"
        aria-label="Search location"
      />
      <button type="submit" className="header_search_button" aria-label="Search stays">
        <SearchIcon />
      </button>
    </form>
  )

  return (
    <div className={`header ${isHomeHeader ? 'header_home' : ''}`}>
      <div className="header_top">
        <Link to="/home" className="header_logo_link" onClick={handleLogoClick} aria-label="Go to home page">
          <img src={selectedLogo} className="header_logo" alt="Airbnb logo" />
        </Link>

        {isHomeHeader && (
          <nav className="header_nav">
            <a href="#">Places to stay</a>
            <a href="#">Experiences</a>
            <a href="#">Online Experiences</a>
          </nav>
        )}

        {compactSearch && (
          <div className="header_top_search">
            {compactSearchForm}
          </div>
        )}

        <div className='header_right' ref={profileRef}>
          {user ? (
            <span>Hello, {user.username}</span>
          ) : (
            <Link to="/login">Become a host</Link>
          )}
          <button type="button" className="header_language" aria-label="Change language">
            <LanguageIcon className="header_language_icon" />
          </button>
          <button
            type="button"
            className="header_profile"
            aria-label="Open profile menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            onMouseDown={() => {
              setShowDates(false)
              setShowGuests(false)
              setShowLocations(false)
            }}
          >
            <MenuIcon className="header_menu_icon" />
            <AccountCircleOutlinedIcon className="header_account_icon" />
          </button>

          {showProfileMenu && (
            <div className="header_profile_menu">
              {user ? (
                <>
                  {user.role === 'host' && <Link to="/admin">Admin Dashboard</Link>}
                  <Link className="no_hover" to="/admin/reservations">View Reservations</Link>
                  <button type="button" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <Link className="no_hover" to="/login">Login</Link>
              )}
            </div>
          )}
        </div>
      </div>

      {!hideSearch && !compactSearch && (
      <div className={`header_center ${isResultsHeader ? 'header_center_compact' : ''}`}>
        <div className="header_search_fields">
          {isResultsHeader ? (
            <>
              <div className="header_search_field header_location_field header_compact_location" ref={locationRef}>
                <button
                  type="button"
                  className={`compact_search_value ${selectedLocation || (locationFromUrl && !locationWasCleared) ? 'search_value_selected' : ''}`}
                  onClick={() => {
                    setShowLocations(!showLocations)
                    setShowDates(false)
                    setShowGuests(false)
                    setShowProfileMenu(false)
                  }}
                >
                  {compactLocationLabel}
                </button>

                {showLocations && (
                  <div className="locations_popup">
                    <button type="button" onClick={handleAllLocations}>
                      All locations
                    </button>
                    {uniqueLocations.map((location) => (
                      <button
                        type="button"
                        className={selectedLocation === location ? 'location_option_active' : ''}
                        key={location}
                        onClick={() => handleLocationChange(location)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="header_search_field header_date_field header_compact_date" ref={checkInRef}>
                <button
                  type="button"
                  className={`date_toggle compact_search_value ${checkInDate ? 'search_value_selected' : ''}`}
                  onClick={() => openCalendar(checkInDate && !checkOutDate ? 'checkout' : 'checkin')}
                >
                  {formatDateRange(checkInDate, checkOutDate)}
                </button>

                {showDates && (
                  <DatesPopup
                    monthDate={calendarMonth}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    activeDateField={activeDateField}
                    onSelectDate={selectDate}
                    onPrevMonth={goToPreviousMonth}
                    onNextMonth={goToNextMonth}
                  />
                )}
              </div>

              <div className="header_search_field header_guest_field header_compact_guests" ref={guestsRef}>
                <button
                  type="button"
                  className={`guest_toggle compact_search_value ${totalGuests > 0 ? 'search_value_selected' : ''}`}
                  onClick={() => {
                    setShowGuests(!showGuests)
                    setShowDates(false)
                    setShowLocations(false)
                    setShowProfileMenu(false)
                  }}
                >
                  {guestLabel}
                </button>

                {showGuests && (
                  <GuestsPopup
                    adults={adults}
                    childrenCount={children}
                    addGuest={addGuest}
                    removeGuest={removeGuest}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="header_search_field header_location_field" ref={locationRef}>
                <strong>Location</strong>
              <div className="header_location_select">
                <button
                  type="button"
                  className={selectedLocation ? 'header_location_value' : ''}
                  onClick={() => {
                    setShowLocations(!showLocations)
                    setShowDates(false)
                    setShowGuests(false)
                    setShowProfileMenu(false)
                  }}
                >
                  {selectedLocationLabel}
                </button>

                {showLocations && (
                  <div className="locations_popup">
                
                    <button type="button" onClick={handleAllLocations}>
                      All locations
                    </button>
                  {uniqueLocations.map((location) => (
                      <button
                        type="button"
                        className={selectedLocation === location ? 'location_option_active' : ''}
                        key={location}
                        onClick={() => handleLocationChange(location)}
                      >
                        {location}
                      </button>
                  ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="header_search_field header_date_field" ref={checkInRef}>
              <strong>Check in</strong>
              <button
                type="button"
                className={`date_toggle ${checkInDate ? 'search_value_selected' : ''}`}
                onClick={() => openCalendar('checkin')}
              >
                {formatDate(checkInDate)}
              </button>

              {showDates && activeDateField === 'checkin' && (
                <DatesPopup
                  monthDate={calendarMonth}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  activeDateField={activeDateField}
                  onSelectDate={selectDate}
                  onPrevMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                />
              )}
            </div>

            <div className="header_search_field header_date_field" ref={checkOutRef}>
              <strong>Check out</strong>
              <button
                type="button"
                className={`date_toggle ${checkOutDate ? 'search_value_selected' : ''}`}
                onClick={() => openCalendar('checkout')}
              >
                {formatDate(checkOutDate)}
              </button>

              {showDates && activeDateField === 'checkout' && (
                <DatesPopup
                  monthDate={calendarMonth}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  activeDateField={activeDateField}
                  onSelectDate={selectDate}
                  onPrevMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                />
              )}
            </div>

            <div className="header_search_field header_guest_field" ref={guestsRef}>
              <strong>Guests</strong>
              <button
                type="button"
                className={`guest_toggle ${totalGuests > 0 ? 'search_value_selected' : ''}`}
                onClick={() => {
                  setShowGuests(!showGuests)
                  setShowDates(false)
                  setShowLocations(false)
                  setShowProfileMenu(false)
                }}
              >
                {guestLabel}
              </button>

              {showGuests && (
                <GuestsPopup
                  adults={adults}
                  childrenCount={children}
                  addGuest={addGuest}
                  removeGuest={removeGuest}
                />
              )}
            </div>
            </>
          )}

            <button type="button" className="header_search_button" onClick={handleSearch} aria-label="Search stays">
              <SearchIcon />
            </button>
        </div>
      </div>
      )}
    </div>
  )
}

export default Header
