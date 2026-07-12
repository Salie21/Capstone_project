import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AdminHeader from '../../Components/AdminHeader'
import { useAuth } from '../../context/AuthContext'
import './Reservations.css'
import API_URL from '../../utils/api'

const formatReservationDate = (value) => {
  if (!value) {
    return ''
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value
  }

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-GB')
}

const Reservations = () => {
  const { user, token } = useAuth()
  const [reservations, setReservations] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')
  const isHost = user?.role === 'host'

  const deleteReservation = async (reservationId) => {
    setDeletingId(reservationId)
    setError('')

    try {
      await axios.delete(`${API_URL}/api/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setReservations((currentReservations) =>
        currentReservations.filter((reservation) => reservation._id !== reservationId)
      )
    } catch {
      setError('Could not delete reservation')
    } finally {
      setDeletingId('')
    }
  }

  useEffect(() => {
    const getReservations = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        if (!isHost) {
          const response = await axios.get(`${API_URL}/api/reservations/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          setReservations(Array.isArray(response.data) ? response.data : [])
        } else {
          const [userResponse, hostResponse] = await Promise.all([
            axios.get(`${API_URL}/api/reservations/user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get(`${API_URL}/api/reservations/host`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ])

          const userReservations = Array.isArray(userResponse.data) ? userResponse.data : []
          const hostReservations = Array.isArray(hostResponse.data) ? hostResponse.data : []
          const combinedReservations = [...userReservations, ...hostReservations]

          setReservations(combinedReservations)
        }
      } catch {
        setError('Could not load reservations')
      } finally {
        setLoading(false)
      }
    }

    getReservations()
  }, [isHost, token])

  return (
    <div className="reservations_page">
      <AdminHeader />

      <main className="reservations_main">
        <h1>My Reservations</h1>
        {error && <p className="reservations_error">{error}</p>}

        <div className="reservations_table_wrap">
          <table className="reservations_table">
            <thead>
              <tr>
                <th>Booked by</th>
                <th>Property name</th>
                <th>Check-in Date</th>
                <th>Check-out Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.bookedBy || user?.username || 'Guest'}</td>
                  <td>{reservation.property}</td>
                  <td>{formatReservationDate(reservation.checkin)}</td>
                  <td>{formatReservationDate(reservation.checkout)}</td>
                  <td>
                    <button
                      type="button"
                      className="reservations_delete"
                      disabled={deletingId === reservation._id}
                      onClick={() => deleteReservation(reservation._id)}
                    >
                      {deletingId === reservation._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && reservations.length === 0 && (
                <tr>
                  <td colSpan="5" className="reservations_empty">
                    No reservations to display.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="5" className="reservations_empty">
                    Loading reservations...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Reservations
