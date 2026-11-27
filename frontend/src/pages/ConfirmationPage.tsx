import { Link, useLocation } from 'react-router-dom'
import OrderSummary from '@/components/OrderSummary'
import type { BookingDraft } from '@/context/BookingContext'
import './AuthPages.css'
import './CheckoutPage.css'

type ConfirmedOrder = {
    bookingNumber: string
    // A copy of the order as it was placed, kept after the saved order is cleared
    booking: BookingDraft
    email: string
}

// Shown after PaymentPage books the seats. The order arrives through the router state, so a refresh keeps it,
// but opening this address directly shows nothing to display.
function ConfirmationPage() {
    const location = useLocation()
    const order = (location.state as { order?: ConfirmedOrder } | null)?.order

    if (!order) {
        return (
            <section className="auth-page" aria-labelledby="confirmation-empty-title">
                <div className="auth-card checkout-card">
                    <h1 id="confirmation-empty-title">No recent order</h1>
                    <p className="auth-intro">
                        There is no order to show here. Orders you have just placed appear on this page right after you
                        pay.
                    </p>
                    <Link className="auth-button" to="/">
                        Browse movies
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section className="auth-page" aria-labelledby="confirmation-title">
            <div className="auth-card checkout-card">
                <h1 id="confirmation-title">Booking confirmed</h1>

                <p className="form-message success" role="status">
                    Your seats are booked. Your booking number is <strong>{order.bookingNumber}</strong>.
                </p>
                <p className="auth-intro">A confirmation email will be sent to {order.email}.</p>

                <OrderSummary booking={order.booking} email={order.email} />

                <p className="auth-links">
                    <Link to="/">Browse more movies</Link>
                    <Link to="/profile">My profile</Link>
                </p>
            </div>
        </section>
    )
}

export default ConfirmationPage