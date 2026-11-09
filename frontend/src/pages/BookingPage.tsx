import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Movie } from '@/types/movie'
import type { SeatMap, Show, TicketType } from '@/types/show'
import { TICKET_LABELS, TICKET_TYPES } from '@/types/show'
import { backendFacade } from '@/services/BackendFacade'
import { fetchSeatMap, fetchShow, fetchTicketPrices } from '@/services/BookingApi'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { formatShowDate, formatShowTime } from '@/utils/ShowFormat'
import './BookingPage.css'

type BookingRouteParams = {
  movie_id: string
  show_id: string
}

// Largest number of tickets in a single order (assumption; change if the instructor sets a limit)
const MAX_TICKETS = 10

function sortSeats(seats: string[]): string[] {
  return [...seats].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function BookingPage() {
  const { movie_id, show_id } = useParams<BookingRouteParams>()
  const navigate = useNavigate()
  const { isLoggedIn, user, loading: authLoading } = useAuth()
  const { booking, setBooking } = useBooking()

  const movieId = Number(movie_id)
  const showId = Number(show_id)

  // Restore an earlier selection for this same show (after logging in, or coming back from checkout)
  const savedDraft = booking && booking.showId === showId ? booking : null

  const [movie, setMovie] = useState<Movie | null>(null)
  const [show, setShow] = useState<Show | null>(null)
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null)
  const [prices, setPrices] = useState<Record<TicketType, number> | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [tickets, setTickets] = useState<Record<TicketType, number>>(
    savedDraft?.tickets ?? { ADULT: 0, CHILD: 0, SENIOR: 0 }
  )
  const [selectedSeats, setSelectedSeats] = useState<string[]>(savedDraft?.seats ?? [])
  const [formError, setFormError] = useState<string>('')
  const [notice, setNotice] = useState<string>('')

  // Load the movie, show, seat map, and ticket prices
  useEffect(() => {
    if (!movie_id || Number.isNaN(movieId) || !show_id || Number.isNaN(showId)) {
      setError('Invalid movie or show in the URL.')
      setIsLoading(false)
      return
    }

    // Wait for the login check so the customer's own held seats are not shown as taken
    if (authLoading) return

    let cancelled = false

    const load = async () => {
      try {
        const showData = await fetchShow(movieId, showId)
        const [movieResult, seatMapData, priceMap] = await Promise.all([
          backendFacade.getMovieById(movieId),
          fetchSeatMap(showData, user?.id),
          fetchTicketPrices(),
        ])

        // The backend answers 200 with an empty body for an unknown movie id
        const movieData = movieResult as Movie | null | undefined
        if (!movieData) {
          throw new Error('Movie not found.')
        }

        if (cancelled) return

        setMovie(movieData)
        setShow(showData)
        setSeatMap(seatMapData)
        setPrices(priceMap)

        // Drop any restored seats that another customer has taken since
        const restored = savedDraft?.seats ?? []
        const taken = new Set(seatMapData.unavailableSeats)
        const stillFree = restored.filter((seat) => !taken.has(seat))
        if (stillFree.length !== restored.length) {
          setSelectedSeats(stillFree)
          setNotice('Some seats you picked earlier were taken by another customer. Please choose replacements.')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load booking details.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [movie_id, show_id, authLoading, user?.id])

  // Keep the in-progress order saved, so the selection survives the login step and refreshes
  useEffect(() => {
    if (!movie || !show || !prices) return

    setBooking((previous) => ({
      movieId,
      movieTitle: movie.title,
      showId,
      showDate: show.showDate,
      showTime: show.showTime,
      showroomId: show.showroomId,
      tickets,
      seats: selectedSeats,
      prices,
      email: previous && previous.showId === showId ? previous.email : '',
    }))
  }, [movie, show, prices, tickets, selectedSeats])

  if (isLoading) {
    return <div>Loading booking details...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!movie || !show || !seatMap || !prices) {
    return <div>Booking details are unavailable.</div>
  }

  const unavailable = new Set(seatMap.unavailableSeats)
  const availableCount = seatMap.seatCount - unavailable.size
  const maxTickets = Math.min(MAX_TICKETS, availableCount)

  const totalTickets = TICKET_TYPES.reduce((sum, type) => sum + tickets[type], 0)
  const subtotal = TICKET_TYPES.reduce((sum, type) => sum + tickets[type] * prices[type], 0)

  const changeTickets = (type: TicketType, rawValue: string): void => {
    const parsed = Math.floor(Number(rawValue))
    const requested = Number.isNaN(parsed) ? 0 : Math.max(0, parsed)

    const others = totalTickets - tickets[type]
    const allowed = Math.max(0, Math.min(requested, maxTickets - others))

    setFormError(
      allowed < requested ? `You can book at most ${maxTickets} tickets for this show in one order.` : ''
    )
    setNotice('')
    setTickets({ ...tickets, [type]: allowed })

    // Fewer tickets than seats: keep only as many seats as tickets
    const newTotal = others + allowed
    if (selectedSeats.length > newTotal) {
      setSelectedSeats(selectedSeats.slice(0, newTotal))
      setNotice('Your seat selection was reduced to match your number of tickets.')
    }
  }

  const toggleSeat = (seat: string): void => {
    if (unavailable.has(seat)) return

    setNotice('')

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((selectedSeat) => selectedSeat !== seat))
      setFormError('')
      return
    }

    if (totalTickets === 0) {
      setFormError('Choose your tickets first, then pick your seats.')
      return
    }

    if (selectedSeats.length >= totalTickets) {
      setFormError(
        `You have ${totalTickets} ticket${totalTickets === 1 ? '' : 's'}, so you can select ${totalTickets} seat${
          totalTickets === 1 ? '' : 's'
        }. Deselect a seat to choose a different one.`
      )
      return
    }

    setFormError('')
    setSelectedSeats(sortSeats([...selectedSeats, seat]))
  }

  const handleContinue = (): void => {
    if (totalTickets === 0) {
      setFormError('Select at least one ticket.')
      return
    }

    if (selectedSeats.length !== totalTickets) {
      const remaining = totalTickets - selectedSeats.length
      setFormError(
        remaining > 0
          ? `Please select ${remaining} more seat${remaining === 1 ? '' : 's'}. Your seats must match your ${totalTickets} ticket${
              totalTickets === 1 ? '' : 's'
            }.`
          : 'You have selected more seats than tickets.'
      )
      return
    }

    setFormError('')
    // The booking is already saved in the booking context. Guests log in first and are then sent to checkout.
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    navigate('/checkout')
  }

  const seatCountMessage =
    totalTickets === 0
      ? 'Choose your tickets to start picking seats.'
      : `${selectedSeats.length} of ${totalTickets} seat${totalTickets === 1 ? '' : 's'} selected`

  return (
    <div className="booking-page">
      {/* Page header */}
      <div className="booking-header">
        <h1>Book Your Tickets</h1>

        <div className="booking-movie-info">
          <strong>{movie.title}</strong>
          <span>
            {' '}
            — {formatShowDate(show.showDate)} at {formatShowTime(show.showTime)}
          </span>
        </div>
      </div>

      {/* Main booking content */}
      <div className="booking-content">
        {/* Ticket selection */}
        <section className="ticket-section">
          <h2>Tickets</h2>
          <p className="booking-hint">Up to {maxTickets} tickets per order.</p>

          {TICKET_TYPES.map((type) => (
            <div className="ticket-row" key={type}>
              <span className="ticket-type">{TICKET_LABELS[type]}</span>

              <span className="ticket-price">${prices[type].toFixed(2)}</span>

              <input
                className="ticket-quantity"
                type="number"
                min="0"
                max={maxTickets}
                value={tickets[type]}
                aria-label={`${TICKET_LABELS[type]} tickets`}
                onChange={(e) => changeTickets(type, e.target.value)}
              />
            </div>
          ))}
        </section>

        {/* Seating */}
        <section className="seating-section">
          <h2>Select Your Seats</h2>

          <div className="cinema-screen">SCREEN</div>

          <div className="seat-layout">
            {seatMap.rows.map((row, rowIndex) => (
              <div className="seat-row" key={row}>
                <span className="row-label">{row}</span>

                {Array.from({ length: seatMap.seatsPerRow }, (_, index) => index + 1)
                  .filter((number) => rowIndex * seatMap.seatsPerRow + number <= seatMap.seatCount)
                  .map((number) => {
                  const seat = `${row}${number}`
                  const isBooked = unavailable.has(seat)
                  const isSelected = selectedSeats.includes(seat)

                  return (
                    <button
                      key={seat}
                      type="button"
                      className={isBooked ? 'seat booked' : isSelected ? 'seat selected' : 'seat'}
                      disabled={isBooked}
                      aria-pressed={isSelected}
                      aria-label={`Seat ${seat}, ${isBooked ? 'unavailable' : isSelected ? 'selected' : 'available'}`}
                      onClick={() => toggleSeat(seat)}
                    >
                      {number}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <ul className="seat-legend" aria-label="Seat key">
            <li>
              <span className="seat-swatch available" /> Available
            </li>
            <li>
              <span className="seat-swatch selected" /> Your selection
            </li>
            <li>
              <span className="seat-swatch booked" /> Booked
            </li>
          </ul>

          <p className="seat-count" aria-live="polite">
            {seatCountMessage}
          </p>

          {seatMap.availabilityKnown === false && (
            <p className="booking-message notice" role="status">
              Seats held by other customers could not be loaded, so every seat is shown as available.
            </p>
          )}
        </section>
      </div>

      {/* Booking summary */}
      <section className="booking-summary">
        <h2>Booking Summary</h2>

        <div className="booking-summary-row">
          <span>Movie</span>
          <span>{movie.title}</span>
        </div>

        <div className="booking-summary-row">
          <span>Showtime</span>
          <span>
            {formatShowTime(show.showTime)} : {formatShowDate(show.showDate)}
          </span>
        </div>

        {TICKET_TYPES.map((type) => (
          <div className="booking-summary-row" key={type}>
            <span>{TICKET_LABELS[type]} Tickets</span>
            <span>{tickets[type]}</span>
          </div>
        ))}

        <div className="booking-summary-row">
          <span>Selected Seats</span>
          <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
        </div>

        <div className="booking-total">
          <span>Total (before tax)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {notice && (
          <p className="booking-message notice" role="status">
            {notice}
          </p>
        )}

        {formError && (
          <p className="booking-message error" role="alert">
            {formError}
          </p>
        )}

        <button type="button" className="booking-continue" onClick={handleContinue}>
          Proceed to Checkout
        </button>

        {!isLoggedIn && (
          <p className="booking-hint">
            You can pick seats without an account. You will be asked to log in before checkout, and your seats stay
            selected.
          </p>
        )}
      </section>
    </div>
  )
}

export default BookingPage