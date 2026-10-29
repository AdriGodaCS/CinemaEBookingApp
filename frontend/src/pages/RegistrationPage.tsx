import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../components/FormField'
import './AuthPages.css'

const API_URL = 'http://localhost:8080'
const MAX_CARDS = 3

type CardEntry = {
    cardNumber: string
    expiration: string
    sameAsHome: boolean
    billingStreet: string
    billingCity: string
    billingState: string
    billingZip: string
}
type CardTextField = Exclude<keyof CardEntry, 'sameAsHome'>
// Error keys for a card are `${field}${index}`, which also match the input ids (used to focus the first error)
const CARD_ERROR_FIELDS: CardTextField[] = [
    'cardNumber', 'expiration', 'billingStreet', 'billingCity', 'billingState', 'billingZip',
]
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
// Letters (including accented), spaces, hyphens, apostrophes, and periods; must start with a letter
const NAME_PATTERN = /^\p{L}[\p{L}\s'.-]*$/u
// Only digits and common phone punctuation; the digit count is checked separately
const PHONE_CHARS_PATTERN = /^[\d\s().+-]+$/
const US_STATES = new Set([
    'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN',
    'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA',
    'WV','WI','WY',
])

// Strips formatting and a leading US country code so the backend always gets 10 digits
function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, '')
    return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
}
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
    else if (!NAME_PATTERN.test(values.firstName.trim()))
        errors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes.'
    if (!values.lastName.trim()) errors.lastName = 'Enter your last name.'
    else if (!NAME_PATTERN.test(values.lastName.trim()))
        errors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes.'

    if (!values.email.trim()) errors.email = 'Enter your email address.'
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address, like name@example.com.'

    if (!values.phone.trim()) errors.phone = 'Enter your phone number.'
    else if (!PHONE_CHARS_PATTERN.test(values.phone.trim()) || normalizePhone(values.phone).length !== 10)
        errors.phone = 'Enter a 10-digit phone number, like 404-555-0123.'

    if (!values.password) errors.password = 'Create a password.'
    else if (!PASSWORD_PATTERN.test(values.password))
        errors.password = 'Use at least 8 characters with an uppercase letter, a lowercase letter, a number, and a special character.'

    if (!values.confirmPassword) errors.confirmPassword = 'Re-enter your password.'
    else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'

    // Address is optional, but if the section is open it must be complete
    if (showAddress) {
        if (!values.street.trim()) errors.street = 'Enter your street address.'
        if (!values.city.trim()) errors.city = 'Enter your city.'
        if (!US_STATES.has(values.state.trim().toUpperCase())) errors.state = 'Enter a valid 2-letter state code, like GA.'
        if (!/^\d{5}$/.test(values.zip.trim())) errors.zip = 'Enter a 5-digit ZIP code.'
    }

    // Cards are optional, but any card that was added must be complete
    const seenNumbers = new Set<string>()
    cards.forEach((card, index) => {
        if (!/^\d{13,19}$/.test(card.cardNumber)) errors[`cardNumber${index}`] = 'Enter a card number with 13 to 19 digits.'
        else if (seenNumbers.has(card.cardNumber)) errors[`cardNumber${index}`] = 'This card number was already entered.'
        else seenNumbers.add(card.cardNumber)
        if (!isValidExpiration(card.expiration)) errors[`expiration${index}`] = 'Enter a valid, unexpired date as MM/YY.'

        // Every card needs a billing address: either the home address or its own
        if (!(card.sameAsHome && showAddress)) {
            if (!card.billingStreet.trim()) errors[`billingStreet${index}`] = 'Enter the billing street address.'
            if (!card.billingCity.trim()) errors[`billingCity${index}`] = 'Enter the billing city.'
            if (!US_STATES.has(card.billingState.trim().toUpperCase()))
                errors[`billingState${index}`] = 'Enter a valid 2-letter state code, like GA.'
            if (!/^\d{5}$/.test(card.billingZip.trim())) errors[`billingZip${index}`] = 'Enter a 5-digit ZIP code.'
        }
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
    const [duplicateEmail, setDuplicateEmail] = useState(false)
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
        if (name === 'email') setDuplicateEmail(false)
    }

    // A card reuses the home address only while the home address section is open
    const usesHome = (card: CardEntry) => card.sameAsHome && showAddress

    const addCard = () => {
        if (cards.length < MAX_CARDS)
            setCards([
                ...cards,
                {
                    cardNumber: '',
                    expiration: '',
                    sameAsHome: showAddress,
                    billingStreet: '',
                    billingCity: '',
                    billingState: '',
                    billingZip: '',
                },
            ])
    }

    const removeCard = (index: number) => {
        setCards(cards.filter((_, cardIndex) => cardIndex !== index))
        setErrors((previous) => {
            // Card errors are keyed by position, so drop them all and let validation re-run on submit
            const rest = { ...previous }
            cards.forEach((_, i) => {
                CARD_ERROR_FIELDS.forEach((field) => delete rest[`${field}${i}`])
            })
            return rest
        })
    }

    const updateCard = (index: number, field: CardTextField, value: string) => {
        let cleaned = value
        if (field === 'cardNumber') cleaned = value.replace(/\D/g, '').slice(0, 19)
        else if (field === 'expiration') cleaned = formatExpiration(value)
        else if (field === 'billingState') cleaned = value.toUpperCase().slice(0, 2)
        else if (field === 'billingZip') cleaned = value.replace(/\D/g, '').slice(0, 5)

        setCards((previous) =>
            previous.map((card, cardIndex) => (cardIndex === index ? { ...card, [field]: cleaned } : card)),
        )
        clearError(`${field}${index}`)
    }

    const toggleSameAsHome = (index: number, checked: boolean) => {
        setCards((previous) =>
            previous.map((card, cardIndex) => (cardIndex === index ? { ...card, sameAsHome: checked } : card)),
        )
        // Billing errors no longer apply (or will be re-checked on submit)
        setErrors((previous) => {
            const rest = { ...previous }
            ;(['billingStreet', 'billingCity', 'billingState', 'billingZip'] as const).forEach((field) => {
                delete rest[`${field}${index}`]
            })
            return rest
        })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setServerError('')
        setDuplicateEmail(false)

        const validationErrors = validate(values, showAddress, cards)
        setErrors(validationErrors)
        const firstInvalidId = Object.keys(validationErrors)[0]
        if (firstInvalidId) {
            // Error keys match the input ids, and keys are added in page order
            setTimeout(() => document.getElementById(firstInvalidId)?.focus(), 0)
            return
        }

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
            phone: normalizePhone(values.phone),
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
                        billingAddress: usesHome(card)
                            ? homeAddress
                            : {
                                  street: card.billingStreet.trim(),
                                  city: card.billingCity.trim(),
                                  state: card.billingState.trim().toUpperCase(),
                                  zipCode: card.billingZip.trim(),
                              },
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
                    // Distinct duplicate-email error: field message, a banner with next steps, and focus on the field
                    setErrors({ email: 'An account with this email already exists.' })
                    setDuplicateEmail(true)
                    setTimeout(() => document.getElementById('email')?.focus(), 0)
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
                    {duplicateEmail && (
                        <p className="form-message error" role="alert">
                            You already have an account with this email. <Link to="/login">Log in</Link> or{' '}
                            <Link to="/forgot-password">reset your password</Link>, or use a different email address.
                        </p>
                    )}

                    <fieldset>
                        <legend>Personal information</legend>
                        <div className="form-row">
                            <FormField id="firstName" name="firstName" label="First name" required maxLength={50} autoComplete="given-name"
                                value={values.firstName} onChange={handleChange} error={errors.firstName} />
                            <FormField id="lastName" name="lastName" label="Last name" required maxLength={50} autoComplete="family-name"
                                value={values.lastName} onChange={handleChange} error={errors.lastName} />
                        </div>
                        <FormField id="email" name="email" type="email" label="Email" required maxLength={254} autoComplete="email"
                            value={values.email} onChange={handleChange} error={errors.email} />
                        <FormField id="phone" name="phone" type="tel" label="Phone number" required maxLength={20} autoComplete="tel"
                            placeholder="404-555-0123" value={values.phone} onChange={handleChange} error={errors.phone} />
                        <FormField id="password" name="password" type="password" label="Password" required maxLength={64} autoComplete="new-password"
                            hint="At least 8 characters with uppercase, lowercase, a number, and a special character."
                            value={values.password} onChange={handleChange} error={errors.password} />
                        <FormField id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" required maxLength={64}
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
                                <FormField id="street" name="street" label="Street address" required maxLength={100} autoComplete="street-address"
                                    value={values.street} onChange={handleChange} error={errors.street} />
                                <div className="form-row">
                                    <FormField id="city" name="city" label="City" required maxLength={60} autoComplete="address-level2"
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
                                <label className="checkbox-field">
                                    <input type="checkbox" checked={usesHome(card)} disabled={!showAddress}
                                        onChange={(e) => toggleSameAsHome(index, e.target.checked)} />
                                    <span>
                                        Billing address is the same as my home address
                                        {!showAddress && ' (add a home address above to use this)'}
                                    </span>
                                </label>
                                {!usesHome(card) && (
                                    <>
                                        <FormField id={`billingStreet${index}`} label="Billing street address" required maxLength={100}
                                            autoComplete="billing street-address" value={card.billingStreet}
                                            onChange={(e) => updateCard(index, 'billingStreet', e.target.value)}
                                            error={errors[`billingStreet${index}`]} />
                                        <div className="form-row">
                                            <FormField id={`billingCity${index}`} label="Billing city" required maxLength={60}
                                                autoComplete="billing address-level2" value={card.billingCity}
                                                onChange={(e) => updateCard(index, 'billingCity', e.target.value)}
                                                error={errors[`billingCity${index}`]} />
                                            <FormField id={`billingState${index}`} label="Billing state" required maxLength={2}
                                                placeholder="GA" autoComplete="billing address-level1" value={card.billingState}
                                                onChange={(e) => updateCard(index, 'billingState', e.target.value)}
                                                error={errors[`billingState${index}`]} />
                                        </div>
                                        <FormField id={`billingZip${index}`} label="Billing ZIP code" required inputMode="numeric"
                                            maxLength={5} autoComplete="billing postal-code" value={card.billingZip}
                                            onChange={(e) => updateCard(index, 'billingZip', e.target.value)}
                                            error={errors[`billingZip${index}`]} />
                                    </>
                                )}
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