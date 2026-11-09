import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '@/components/FormField'
import OrderSummary from '@/components/OrderSummary'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { isBookingComplete } from '@/utils/BookingMath'
import './AuthPages.css'
import './CheckoutPage.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Reached only by logged-in users (see the /checkout route in App.tsx)
function CheckoutPage() {
    const { user } = useAuth()
    const { booking, setBooking } = useBooking()
    const navigate = useNavigate()

    const accountEmail = user?.email ?? ''
    const savedEmail = booking?.email ?? ''

    // Use the account email unless the user already chose a different one earlier
    const [useAccountEmail, setUseAccountEmail] = useState<boolean>(!savedEmail || savedEmail === accountEmail)
    const [otherEmail, setOtherEmail] = useState<string>(savedEmail && savedEmail !== accountEmail ? savedEmail : '')
    const [emailError, setEmailError] = useState<string>('')

    if (!isBookingComplete(booking)) {
        return (
            <section className="auth-page" aria-labelledby="checkout-empty-title">
                <div className="auth-card checkout-card">
                    <h1 id="checkout-empty-title">Your order is incomplete</h1>
                    <p className="form-message error" role="alert">
                        Choose a showtime, your tickets, and one seat per ticket before checking out.
                    </p>
                    <Link className="auth-button" to="/">
                        Browse movies
                    </Link>
                </div>
            </section>
        )
    }

    const handleContinue = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const chosen = useAccountEmail ? accountEmail : otherEmail.trim()

        if (!chosen) {
            setEmailError('Enter an email address for your order confirmation.')
            return
        }
        if (!EMAIL_PATTERN.test(chosen)) {
            setEmailError('Enter a valid email address, like name@example.com.')
            return
        }

        setEmailError('')
        setBooking({ ...booking, email: chosen.toLowerCase() })
        navigate('/payment')
    }

    return (
        <section className="auth-page" aria-labelledby="checkout-title">
            <div className="auth-card checkout-card">
                <h1 id="checkout-title">Checkout</h1>
                <p className="auth-intro">Review your order, then confirm where to send your confirmation email.</p>

                <OrderSummary booking={booking} />

                <p>
                    <Link to={`/movie/${booking.movieId}/booking/${booking.showId}`}>Change tickets or seats</Link>
                </p>

                <form className="auth-form" onSubmit={handleContinue} noValidate>
                    <fieldset>
                        <legend>Confirmation email</legend>

                        <label className="checkbox-field">
                            <input
                                type="radio"
                                name="emailChoice"
                                checked={useAccountEmail}
                                onChange={() => {
                                    setUseAccountEmail(true)
                                    setEmailError('')
                                }}
                            />
                            <span>
                                Use my account email: <strong>{accountEmail}</strong>
                            </span>
                        </label>

                        <label className="checkbox-field">
                            <input
                                type="radio"
                                name="emailChoice"
                                checked={!useAccountEmail}
                                onChange={() => {
                                    setUseAccountEmail(false)
                                    setEmailError('')
                                }}
                            />
                            <span>Use a different email</span>
                        </label>

                        {!useAccountEmail && (
                            <FormField
                                id="otherEmail"
                                name="otherEmail"
                                type="email"
                                label="Email for your confirmation"
                                required
                                autoComplete="email"
                                maxLength={254}
                                value={otherEmail}
                                onChange={(e) => {
                                    setOtherEmail(e.target.value)
                                    setEmailError('')
                                }}
                                error={emailError}
                            />
                        )}

                        {useAccountEmail && emailError && (
                            <p className="field-error" role="alert">
                                {emailError}
                            </p>
                        )}
                    </fieldset>

                    <button type="submit" className="auth-button">
                        Continue to payment
                    </button>
                </form>
            </div>
        </section>
    )
}

export default CheckoutPage