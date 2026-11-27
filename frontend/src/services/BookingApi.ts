import { BackendError, backendFacade } from '@/services/BackendFacade'
import type { BookingDraft } from '@/context/BookingContext'
import { TICKET_TYPES } from '@/types/show'
import type { SeatMap, Show, TicketType } from '@/types/show'
import { getOrderTotals } from '@/utils/BookingMath'

// The backend stores only a seat COUNT per showroom, so the grid is built from it: rows A, B, C...
// with SEATS_PER_ROW seats each (the last row may be shorter).
const SEATS_PER_ROW = 8
const MAX_ROWS = 26

// Seat locks store seatId as a number. We number seats row by row starting at 1:
// A1 = 1, A2 = 2, ... A8 = 8, B1 = 9, and so on. Confirm this numbering with the team.

// There is no ticket price endpoint yet, so these are the prices the booking page already used.
// Replace with a backend call once admins can manage ticket prices.
const DEFAULT_PRICES: Record<TicketType, number> = { ADULT: 12, CHILD: 8, SENIOR: 10 }

// Lock statuses that no longer hold a seat
const INACTIVE_LOCK_STATUSES = ['RELEASED', 'EXPIRED', 'CANCELLED']

interface ShowroomData {
    id: number
    name: string
    seatCount: number
}

interface SeatLockData {
    id: number
    showId: number
    seatId: number | string
    customerId: number
    status: string
    expiresAt: string
}

function rowLetter(index: number): string {
    return String.fromCharCode(65 + index)
}

function seatLabel(seatId: number | string, seatsPerRow: number, seatCount: number): string | null {
    if (typeof seatId === 'string') {
        return /^[A-Za-z]\d+$/.test(seatId) ? seatId.toUpperCase() : null
    }
    if (!Number.isInteger(seatId) || seatId < 1 || seatId > seatCount) return null

    const index = seatId - 1
    return `${rowLetter(Math.floor(index / seatsPerRow))}${(index % seatsPerRow) + 1}`
}

// GET /shows/by-movie-id/{movieId}
export async function fetchShowsForMovie(movieId: number): Promise<Show[]> {
    const shows = await backendFacade.getShowsByMovieId(movieId)
    return Array.isArray(shows) ? (shows as Show[]) : []
}

// The backend route GET /shows/{id} currently reads the id as a query parameter, so it cannot be called
// as /shows/5. Look the show up in the movie's list instead, which also works for logged-out visitors.
export async function fetchShow(movieId: number, showId: number): Promise<Show> {
    const shows = await fetchShowsForMovie(movieId)
    const show = shows.find((candidate) => candidate.id === showId)

    if (!show) {
        throw new Error('This showtime could not be found.')
    }
    return show
}

// Builds the seat layout from GET /showrooms/{id} and marks seats held by other customers
// using GET /seatlocks/show/{showId}.
export async function fetchSeatMap(show: Show, currentUserId?: number): Promise<SeatMap> {
    const showroom = (await backendFacade.getShowroomById(show.showroomId)) as ShowroomData | null | undefined

    if (!showroom || !showroom.seatCount || showroom.seatCount < 1) {
        throw new Error('The showroom for this showtime could not be found.')
    }

    const seatCount = showroom.seatCount
    const seatsPerRow = Math.max(SEATS_PER_ROW, Math.ceil(seatCount / MAX_ROWS))
    const rows = Array.from({ length: Math.ceil(seatCount / seatsPerRow) }, (_, index) => rowLetter(index))

    const unavailable = new Set<string>()
    let availabilityKnown = true

    try {
        const locks = (await backendFacade.getSeatLocksByShowId(show.id)) as SeatLockData[] | undefined

        ;(locks ?? [])
            .filter((lock) => !INACTIVE_LOCK_STATUSES.includes((lock.status ?? '').toUpperCase()))
            // The customer's own held seats stay selectable
            .filter((lock) => currentUserId === undefined || lock.customerId !== currentUserId)
            .forEach((lock) => {
                // TODO (final demo): ignore locks whose expiresAt has passed. Automatic unlocking is not required yet.
                const label = seatLabel(lock.seatId, seatsPerRow, seatCount)
                if (label) unavailable.add(label)
            })
    } catch (error) {
        // The seat lock route currently requires login, so a logged-out visitor gets 403
        if (error instanceof BackendError && (error.status === 403 || error.status === 404)) {
            availabilityKnown = false
        } else {
            throw error
        }
    }

    return {
        showId: show.id,
        rows,
        seatsPerRow,
        seatCount,
        unavailableSeats: [...unavailable],
        availabilityKnown,
    }
}

export async function fetchTicketPrices(): Promise<Record<TicketType, number>> {
    return DEFAULT_PRICES
}

// The server answers with the saved Booking. The booking number is created by the server; until it does that, the
// record id is the only reference there is.
export interface BookingResult {
    id?: number
    bookingNumber?: string | null
}

// POST /bookings. The request body is the backend Booking entity itself (model/booking/Booking.java):
//  - top-level properties use camelCase (showId, showDate, ...);
//  - tickets and payment are free-form maps stored as they are, so they use the snake_case keys of the bookings
//    sample data (seat_id, ticket_type, ...);
//  - the customer comes from the login token, so no customer id is sent.
// Fields the entity does not have yet (bookingFee, tax, confirmationEmail) are ignored by the server until they are
// added to Booking.java. See booking-backend-fixes.md. The id, booking number, status, ticket numbers, and
// timestamps must be created by the server, so they are not sent.
export async function createBooking(booking: BookingDraft, paymentCardId: string): Promise<BookingResult> {
    const totals = getOrderTotals(booking)

    // Give each seat a ticket type in order: adult tickets first, then child, then senior
    const ticketTypes: TicketType[] = TICKET_TYPES.flatMap((type) =>
        Array<TicketType>(booking.tickets[type]).fill(type)
    )

    const result = (await backendFacade.createBooking({
        showId: booking.showId,
        movieId: booking.movieId,
        showroomId: booking.showroomId,
        showDate: booking.showDate,
        showTime: booking.showTime,
        tickets: booking.seats.map((seat, index) => ({
            seat_id: seat,
            ticket_type: ticketTypes[index],
            price: booking.prices[ticketTypes[index]],
        })),
        subtotal: totals.subtotal,
        discount: 0,
        total: totals.total,
        bookingFee: totals.bookingFee,
        tax: totals.tax,
        confirmationEmail: booking.email,
        payment: { card_id: paymentCardId },
    })) as BookingResult | undefined

    // A saved booking is a success even if the server has not created a booking number yet. Reporting a failure
    // here would invite the customer to press Pay again and book the same seats twice.
    if (!result || (result.id === undefined && !result.bookingNumber)) {
        throw new Error('The server did not confirm the booking.')
    }

    return result
}