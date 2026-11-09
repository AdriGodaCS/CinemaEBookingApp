import type { BookingDraft } from '@/context/BookingContext'
import { TICKET_LABELS, TICKET_TYPES } from '@/types/show'
import { getSubtotal } from '@/utils/BookingMath'
import { formatShowDate, formatShowTime } from '@/utils/ShowFormat'

type OrderSummaryProps = {
    booking: BookingDraft
    // Shown as the confirmation email when provided
    email?: string
}

function OrderSummary({ booking, email }: OrderSummaryProps) {
    return (
        <section className="order-summary" aria-label="Order summary">
            <h2>Order summary</h2>

            <div className="order-row">
                <span>Movie</span>
                <span>{booking.movieTitle}</span>
            </div>
            <div className="order-row">
                <span>Showtime</span>
                <span>
                    {formatShowDate(booking.showDate)} at {formatShowTime(booking.showTime)}
                </span>
            </div>
            <div className="order-row">
                <span>Selected seats</span>
                <span>{booking.seats.join(', ')}</span>
            </div>

            <h3>Tickets</h3>
            {TICKET_TYPES.filter((type) => booking.tickets[type] > 0).map((type) => (
                <div className="order-row" key={type}>
                    <span>
                        {booking.tickets[type]} × {TICKET_LABELS[type]} (${booking.prices[type].toFixed(2)} each)
                    </span>
                    <span>${(booking.tickets[type] * booking.prices[type]).toFixed(2)}</span>
                </div>
            ))}

            <div className="order-total">
                <span>Total before tax</span>
                <span>${getSubtotal(booking).toFixed(2)}</span>
            </div>

            {email && (
                <div className="order-row">
                    <span>Confirmation email</span>
                    <span>{email}</span>
                </div>
            )}
        </section>
    )
}

export default OrderSummary