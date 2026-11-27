import type { BookingDraft } from '@/context/BookingContext'
import { TICKET_LABELS, TICKET_TYPES } from '@/types/show'
import { BOOKING_FEE_PER_TICKET, TAX_RATE, getOrderTotals } from '@/utils/BookingMath'
import { formatShowDate, formatShowTime } from '@/utils/ShowFormat'

type OrderSummaryProps = {
    booking: BookingDraft
    // Shown as the confirmation email when provided
    email?: string
}

function OrderSummary({ booking, email }: OrderSummaryProps) {
    const totals = getOrderTotals(booking)

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

            <h3>Charges</h3>
            <div className="order-row">
                <span>Tickets subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="order-row">
                <span>
                    Online booking fee ({totals.ticketCount} × ${BOOKING_FEE_PER_TICKET.toFixed(2)})
                </span>
                <span>${totals.bookingFee.toFixed(2)}</span>
            </div>
            <div className="order-row">
                <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
                <span>${totals.tax.toFixed(2)}</span>
            </div>

            <div className="order-total">
                <span>Order total</span>
                <span>${totals.total.toFixed(2)}</span>
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