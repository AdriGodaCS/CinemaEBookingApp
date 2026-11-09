import { Link } from 'react-router-dom'
import FormField from '@/components/FormField'
import OrderSummary from '@/components/OrderSummary'
import { useBooking } from '@/context/BookingContext'
import { isBookingComplete } from '@/utils/BookingMath'
import './AuthPages.css'
import './CheckoutPage.css'

// Mockup only: payment processing and the final order confirmation are built for the final demo.
function PaymentPage() {
    const { booking } = useBooking()

    if (!isBookingComplete(booking) || !booking.email) {
        return (
            <section className="auth-page" aria-labelledby="payment-empty-title">
                <div className="auth-card checkout-card">
                    <h1 id="payment-empty-title">Your order is incomplete</h1>
                    <p className="form-message error" role="alert">
                        Review your order and confirm your email before going to payment.
                    </p>
                    <Link className="auth-button" to={booking ? '/checkout' : '/'}>
                        {booking ? 'Back to checkout' : 'Browse movies'}
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section className="auth-page" aria-labelledby="payment-title">
            <div className="auth-card checkout-card">
                <h1 id="payment-title">Payment</h1>
                <p className="form-message success" role="status">
                    This is a preview of the payment step. Payment processing and order confirmation will be added in the
                    final demo.
                </p>

                <OrderSummary booking={booking} email={booking.email} />

                <form className="auth-form" onSubmit={(event) => event.preventDefault()} noValidate>
                    <fieldset disabled>
                        <legend>Payment details (preview)</legend>
                        <FormField id="paymentName" label="Name on card" required placeholder="Full name" />
                        <FormField id="paymentCard" label="Card number" required placeholder="1234 5678 9012 3456" />
                        <div className="form-row">
                            <FormField id="paymentExpiration" label="Expiration" required placeholder="MM/YY" />
                            <FormField id="paymentCvv" label="Security code" required placeholder="123" />
                        </div>
                    </fieldset>

                    <button type="submit" className="auth-button" disabled>
                        Pay now
                    </button>
                </form>

                <p className="auth-links">
                    <Link to="/checkout">Back to order summary</Link>
                </p>
            </div>
        </section>
    )
}

export default PaymentPage