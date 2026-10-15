import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../components/FormField'
import './AuthPages.css'

const API_URL = 'http://localhost:8080'
const MAX_CARDS = 3

type CardEntry = { cardNumber: string; expiration: string }
type Errors = Record<string, string>

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    zip: '',
}
type Values = typeof initialValues

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// At least 8 characters with a lowercase, uppercase, number, and special character
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

function isValidExpiration(value: string) {
    const match = /^(\d{2})\/(\d{2})$/.exec(value)
    if (!match) return false
    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    if (month < 1 || month > 12) return false
    const now = new Date()
    return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

function formatExpiration(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function validate(values: Values, showAddress: boolean, cards: CardEntry[]): Errors {
    const errors: Errors = {}

    if (!values.firstName.trim()) errors.firstName = 'Enter your first name.'
    if (!values.lastName.trim()) errors.lastName = 'Enter your last name.'

    if (!values.email.trim()) errors.email = 'Enter your email address.'
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address, like name@example.com.'

    if (!values.phone.trim()) errors.phone = 'Enter your phone number.'
    else if (values.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a 10-digit phone number.'

    if (!values.password) errors.password = 'Create a password.'
    else if (!PASSWORD_PATTERN.test(values.password))
        errors.password = 'Use at least 8 characters with an uppercase letter, a lowercase letter, a number, and a special character.'

    if (!values.confirmPassword) errors.confirmPassword = 'Re-enter your password.'
    else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'

    // Address is optional, but if the section is open it must be complete
    if (showAddress) {
        if (!values.street.trim()) errors.street = 'Enter your street address.'
        if (!values.city.trim()) errors.city = 'Enter your city.'
        if (!/^[A-Za-z]{2}$/.test(values.state.trim())) errors.state = 'Enter a 2-letter state code.'
        if (!/^\d{5}$/.test(values.zip.trim())) errors.zip = 'Enter a 5-digit ZIP code.'
    }

    // Cards are optional, but any card that was added must be complete
    cards.forEach((card, index) => {
        if (!/^\d{13,19}$/.test(card.cardNumber)) errors[`cardNumber${index}`] = 'Enter a card number with 13 to 19 digits.'
        if (!isValidExpiration(card.expiration)) errors[`expiration${index}`] = 'Enter a valid, unexpired date as MM/YY.'
    })

    return errors
}

function RegistrationPage() {
    const [values, setValues] = useState<Values>(initialValues)
    const [promotions, setPromotions] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [cards, setCards] = useState<CardEntry[]>([])
    const [errors, setErrors] = useState<Errors>({})
    const [serverError, setServerError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')

    const clearError = (key: string) =>
        setErrors((previous) => {
            if (!previous[key]) return previous
            const { [key]: _removed, ...rest } = previous
            return rest
        })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setValues((previous) => ({ ...previous, [name]: value }))
        clearError(name)
    }

    const addCard = () => {
        if (cards.length < MAX_CARDS) setCards([...cards, { cardNumber: '', expiration: '' }])
    }

    const removeCard = (index: number) => {
        setCards(cards.filter((_, cardIndex) => cardIndex !== index))
        setErrors((previous) => {
            // Card errors are keyed by position, so drop them all and let validation re-run on submit
            const rest = { ...previous }
            cards.forEach((_, i) => {
                delete rest[`cardNumber${i}`]
                delete rest[`expiration${i}`]
            })
            return rest
        })
    }

    const updateCard = (index: number, field: keyof CardEntry, value: string) => {
        const cleaned = field === 'cardNumber' ? value.replace(/\D/g, '').slice(0, 19) : formatExpiration(value)
        setCards(cards.map((card, cardIndex) => (cardIndex === index ? { ...card, [field]: cleaned } : card)))
        clearError(`${field}${index}`)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setServerError('')

        const validationErrors = validate(values, showAddress, cards)
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) return

        // Field names follow the backend models (Address has zipCode; promotions flag is spelled "recievePromotions").
        // TODO (backend): CreateUserRequest must accept homeAddress (currently "homAddress"), recievePromotions,
        // and a list of AddPaymentCardRequest-style cards, and createUser must save them.
        const homeAddress = showAddress
            ? {
                  street: values.street.trim(),
                  city: values.city.trim(),
                  state: values.state.trim().toUpperCase(),
                  zipCode: values.zip.trim(),
              }
            : undefined

        const payload = {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim().toLowerCase(),
            phone: values.phone.replace(/\D/g, ''),
            password: values.password,
            recievePromotions: promotions,
            ...(homeAddress && { homeAddress }),
            ...(cards.length > 0 && {
                paymentCards: cards.map((card) => {
                    const [month, year] = card.expiration.split('/')
                    return {
                        cardNumber: card.cardNumber,
                        expirationMonth: Number(month),
                        expirationYear: 2000 + Number(year),
                        // Reuses the home address as the billing address when one was entered
                        ...(homeAddress && { billingAddress: homeAddress }),
                    }
                }),
            }),
        }

        setSubmitting(true)
        try {
            // Backend route is POST /users (permitted in SecurityConfig)
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                const message: string = data?.message ?? ''
                // Backend throws "A user with that email already exists"; the status code depends on the controller
                if (response.status === 409 || message.toLowerCase().includes('already exists')) {
                    setErrors({ email: 'An account with this email already exists. Log in or use a different email.' })
                } else {
                    setServerError(message || 'We could not create your account. Please try again.')
                }
            } else {
                // Account is created as INACTIVE and the user is NOT logged in
                setRegisteredEmail(payload.email)
            }
        } catch {
            setServerError('Unable to reach the server. Check your connection and try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (registeredEmail) {
        return (
            <section className="auth-page" aria-labelledby="register-success-title">
                <div className="auth-card">
                    <h1 id="register-success-title">Check your email</h1>
                    <p className="form-message success" role="status">
                        Your account has been created. We sent a verification link to {registeredEmail}.
                    </p>
                    <p className="auth-intro">Open the link in that email to verify your account, then log in.</p>
                    <Link className="auth-button" to="/login">
                        Go to log in
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section className="auth-page" aria-labelledby="register-title">
            <div className="auth-card">
                <h1 id="register-title">Create your account</h1>
                <p className="auth-intro">Fields marked with * are required.</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {serverError && (
                        <p className="form-message error" role="alert">
                            {serverError}
                        </p>
                    )}

                    <fieldset>
                        <legend>Personal information</legend>
                        <div className="form-row">
                            <FormField id="firstName" name="firstName" label="First name" required autoComplete="given-name"
                                value={values.firstName} onChange={handleChange} error={errors.firstName} />
                            <FormField id="lastName" name="lastName" label="Last name" required autoComplete="family-name"
                                value={values.lastName} onChange={handleChange} error={errors.lastName} />
                        </div>
                        <FormField id="email" name="email" type="email" label="Email" required autoComplete="email"
                            value={values.email} onChange={handleChange} error={errors.email} />
                        <FormField id="phone" name="phone" type="tel" label="Phone number" required autoComplete="tel"
                            placeholder="404-555-0123" value={values.phone} onChange={handleChange} error={errors.phone} />
                        <FormField id="password" name="password" type="password" label="Password" required autoComplete="new-password"
                            hint="At least 8 characters with uppercase, lowercase, a number, and a special character."
                            value={values.password} onChange={handleChange} error={errors.password} />
                        <FormField id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" required
                            autoComplete="new-password" value={values.confirmPassword} onChange={handleChange}
                            error={errors.confirmPassword} />
                        <label className="checkbox-field">
                            <input type="checkbox" checked={promotions} onChange={(e) => setPromotions(e.target.checked)} />
                            <span>Send me promotions and offers by email</span>
                        </label>
                    </fieldset>

                    <fieldset>
                        <legend>Home address (optional)</legend>
                        {!showAddress ? (
                            <button type="button" className="auth-button secondary" onClick={() => setShowAddress(true)}>
                                Add a home address
                            </button>
                        ) : (
                            <>
                                <FormField id="street" name="street" label="Street address" required autoComplete="street-address"
                                    value={values.street} onChange={handleChange} error={errors.street} />
                                <div className="form-row">
                                    <FormField id="city" name="city" label="City" required autoComplete="address-level2"
                                        value={values.city} onChange={handleChange} error={errors.city} />
                                    <FormField id="state" name="state" label="State" required maxLength={2} autoComplete="address-level1"
                                        placeholder="GA" value={values.state} onChange={handleChange} error={errors.state} />
                                </div>
                                <FormField id="zip" name="zip" label="ZIP code" required inputMode="numeric" maxLength={5}
                                    autoComplete="postal-code" value={values.zip} onChange={handleChange} error={errors.zip} />
                                <button type="button" className="auth-button secondary" onClick={() => setShowAddress(false)}>
                                    Remove address
                                </button>
                            </>
                        )}
                    </fieldset>

                    <fieldset>
                        <legend>Payment cards (optional)</legend>
                        {cards.map((card, index) => (
                            <div key={index} className="form-field">
                                <div className="card-entry-header">
                                    <h3>Card {index + 1}</h3>
                                    <button type="button" className="auth-button secondary" onClick={() => removeCard(index)}>
                                        Remove
                                    </button>
                                </div>
                                <div className="form-row">
                                    <FormField id={`cardNumber${index}`} label="Card number" required inputMode="numeric"
                                        autoComplete="cc-number" value={card.cardNumber}
                                        onChange={(e) => updateCard(index, 'cardNumber', e.target.value)}
                                        error={errors[`cardNumber${index}`]} />
                                    <FormField id={`expiration${index}`} label="Expiration" required placeholder="MM/YY"
                                        autoComplete="cc-exp" value={card.expiration}
                                        onChange={(e) => updateCard(index, 'expiration', e.target.value)}
                                        error={errors[`expiration${index}`]} />
                                </div>
                            </div>
                        ))}
                        <button type="button" className="auth-button secondary" onClick={addCard} disabled={cards.length >= MAX_CARDS}>
                            {cards.length >= MAX_CARDS ? 'Maximum of 3 cards reached' : 'Add a payment card'}
                        </button>
                    </fieldset>

                    <button type="submit" className="auth-button" disabled={submitting}>
                        {submitting ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="auth-links">
                    <span>
                        Already have an account? <Link to="/login">Log in</Link>
                    </span>
                </p>
            </div>
        </section>
    )
}

export default RegistrationPage