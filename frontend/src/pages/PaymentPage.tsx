import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import FormField from '@/components/FormField'
import OrderSummary from '@/components/OrderSummary'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { backendFacade } from '@/services/BackendFacade'
import { isBookingComplete } from '@/utils/BookingMath'
import './AuthPages.css'
import './CheckoutPage.css'

type SavedCard = {
    cardId: string
    expirationMonth: number
    expirationYear: number
    billingAddress: {
        street: string
        city: string
        state: string
        zipCode: string
    } | null
}

type Errors = Record<string, string>

const MAX_CARDS = 3

const US_STATES = new Set([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
    'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
    'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
])

// The backend stores card numbers as a one-way hash, so the last four digits are not available to show.
function cardLabel(index: number): string {
    return `Card ${index + 1}`
}

function fullYear(year: number): number {
    return year < 100 ? 2000 + year : year
}

function isExpired(card: SavedCard): boolean {
    const now = new Date()
    const year = fullYear(card.expirationYear)
    return year < now.getFullYear() || (year === now.getFullYear() && card.expirationMonth < now.getMonth() + 1)
}

function formatExpiration(card: SavedCard): string {
    return `${String(card.expirationMonth).padStart(2, '0')}/${String(fullYear(card.expirationYear) % 100).padStart(2, '0')}`
}

// "1226" -> "12/26" while typing
function formatExpirationInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function isValidExpiration(value: string): boolean {
    const match = /^(\d{2})\/(\d{2})$/.exec(value)
    if (!match) return false

    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    if (month < 1 || month > 12) return false

    const now = new Date()
    return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

// Payment preview: the customer can choose a saved card or add a new one to their profile, but no payment is
// processed in this sprint. Payment processing and the final order confirmation are built for the final demo.
function PaymentPage() {
    const { user } = useAuth()
    const { booking } = useBooking()

    const [cards, setCards] = useState<SavedCard[]>([])
    const [loadingCards, setLoadingCards] = useState<boolean>(true)
    const [loadError, setLoadError] = useState<string>('')
    const [selectedCardId, setSelectedCardId] = useState<string>('')
    const [selectError, setSelectError] = useState<string>('')
    const [notice, setNotice] = useState<string>('')

    // Add-a-card form
    const [showAddForm, setShowAddForm] = useState<boolean>(false)
    const [cardNumber, setCardNumber] = useState<string>('')
    const [expiration, setExpiration] = useState<string>('')
    const [billingStreet, setBillingStreet] = useState<string>('')
    const [billingCity, setBillingCity] = useState<string>('')
    const [billingState, setBillingState] = useState<string>('')
    const [billingZip, setBillingZip] = useState<string>('')
    const [formErrors, setFormErrors] = useState<Errors>({})
    const [addError, setAddError] = useState<string>('')
    const [addedMessage, setAddedMessage] = useState<string>('')
    const [saving, setSaving] = useState<boolean>(false)

    // Load the logged-in customer's saved cards
    useEffect(() => {
        if (!user) return

        let cancelled = false

        const loadCards = async () => {
            try {
                const profile = (await backendFacade.getUserById(user.id)) as
                    | { paymentCards?: SavedCard[] | null }
                    | undefined

                if (!cancelled) {
                    setCards(profile?.paymentCards ?? [])
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(error instanceof Error ? error.message : 'Could not load your saved cards.')
                }
            } finally {
                if (!cancelled) {
                    setLoadingCards(false)
                }
            }
        }

        loadCards()

        return () => {
            cancelled = true
        }
    }, [user?.id])

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

    const selectedIndex = cards.findIndex((card) => card.cardId === selectedCardId)
    const canAddCard = !loadingCards && !loadError && cards.length < MAX_CARDS
    // Customers with no cards see the form straight away; others open it with a button
    const formVisible = canAddCard && (cards.length === 0 || showAddForm)

    const clearFieldError = (key: string) => {
        setFormErrors((previous) => {
            if (!previous[key]) return previous
            const next = { ...previous }
            delete next[key]
            return next
        })
    }

    const validateNewCard = (): Errors => {
        const errors: Errors = {}

        if (!/^\d{13,19}$/.test(cardNumber)) {
            errors.newCardNumber = 'Enter a card number with 13 to 19 digits.'
        }
        if (!isValidExpiration(expiration)) {
            errors.newCardExpiration = 'Enter a valid, unexpired date as MM/YY.'
        }
        if (!billingStreet.trim()) {
            errors.newCardStreet = 'Enter the billing street address.'
        }
        if (!billingCity.trim()) {
            errors.newCardCity = 'Enter the billing city.'
        }
        if (!US_STATES.has(billingState.trim().toUpperCase())) {
            errors.newCardState = 'Enter a valid 2-letter state code, like GA.'
        }
        if (!/^\d{5}$/.test(billingZip.trim())) {
            errors.newCardZip = 'Enter a 5-digit ZIP code.'
        }

        return errors
    }

    const resetAddForm = () => {
        setCardNumber('')
        setExpiration('')
        setBillingStreet('')
        setBillingCity('')
        setBillingState('')
        setBillingZip('')
        setFormErrors({})
        setAddError('')
    }

    const handleAddCard = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!user) return

        setAddError('')
        setAddedMessage('')

        const errors = validateNewCard()
        setFormErrors(errors)

        // Error keys match the input ids and are added in page order
        const firstInvalidId = Object.keys(errors)[0]
        if (firstInvalidId) {
            setTimeout(() => document.getElementById(firstInvalidId)?.focus(), 0)
            return
        }

        const [month, year] = expiration.split('/')

        setSaving(true)
        try {
            await backendFacade.addPaymentCard(user.id, {
                cardNumber,
                expirationMonth: Number(month),
                expirationYear: 2000 + Number(year),
                billingAddress: {
                    street: billingStreet.trim(),
                    city: billingCity.trim(),
                    state: billingState.trim().toUpperCase(),
                    zipCode: billingZip.trim(),
                },
            })

            // Reload the cards; the card just added is the last one in the list
            const profile = (await backendFacade.getUserById(user.id)) as
                | { paymentCards?: SavedCard[] | null }
                | undefined
            const updated = profile?.paymentCards ?? []
            setCards(updated)

            const newest = updated[updated.length - 1]
            if (newest) {
                setSelectedCardId(newest.cardId)
                setSelectError('')
            }

            resetAddForm()
            setShowAddForm(false)
            setNotice('')
            setAddedMessage('Your card was added to your profile and selected for this order.')
        } catch (error) {
            setAddError(error instanceof Error ? error.message : 'We could not add this card. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handlePay = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setNotice('')

        if (selectedIndex === -1) {
            setSelectError('Choose a payment card to continue.')
            return
        }

        setSelectError('')
        setNotice(
            `Payment processing is not available yet, so ${cardLabel(selectedIndex)} was not charged and no seats were booked.`
        )
    }

    return (
        <section className="auth-page" aria-labelledby="payment-title">
            <div className="auth-card checkout-card">
                <h1 id="payment-title">Payment</h1>
                <p className="auth-intro">
                    Choose the card you would like to pay with, or add a new one. Payment processing and order confirmation
                    will be added in the final demo.
                </p>

                <OrderSummary booking={booking} email={booking.email} />

                <div className="auth-form">
                    {/* Saved cards */}
                    <form id="pay-form" onSubmit={handlePay} noValidate>
                        <fieldset>
                            <legend>Choose a payment card</legend>

                            {loadingCards && (
                                <p className="auth-intro" role="status">
                                    Loading your saved cards...
                                </p>
                            )}

                            {loadError && (
                                <p className="form-message error" role="alert">
                                    We could not load your saved cards. {loadError}
                                </p>
                            )}

                            {!loadingCards && !loadError && cards.length === 0 && (
                                <p className="form-message" role="status">
                                    You have no saved payment cards. Add one below to continue.
                                </p>
                            )}

                            {cards.map((card, index) => {
                                const expired = isExpired(card)
                                const selected = card.cardId === selectedCardId

                                return (
                                    <label
                                        key={card.cardId}
                                        className={`payment-card-option${selected ? ' selected' : ''}${expired ? ' expired' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentCard"
                                            value={card.cardId}
                                            checked={selected}
                                            disabled={expired}
                                            onChange={() => {
                                                setSelectedCardId(card.cardId)
                                                setSelectError('')
                                                setNotice('')
                                                setAddedMessage('')
                                            }}
                                        />
                                        <span className="payment-card-details">
                                            <strong>{cardLabel(index)}</strong>
                                            <span>
                                                Expires {formatExpiration(card)}
                                                {expired && ' (expired)'}
                                            </span>
                                            {card.billingAddress && (
                                                <span>
                                                    Billing: {card.billingAddress.street}, {card.billingAddress.city},{' '}
                                                    {card.billingAddress.state} {card.billingAddress.zipCode}
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                )
                            })}

                            {selectError && (
                                <p className="field-error" role="alert">
                                    {selectError}
                                </p>
                            )}
                        </fieldset>
                    </form>

                    {addedMessage && (
                        <p className="form-message success" role="status">
                            {addedMessage}
                        </p>
                    )}

                    {/* Add a card to the profile */}
                    {!loadingCards && !loadError && cards.length >= MAX_CARDS && (
                        <p className="auth-intro">
                            You have {MAX_CARDS} saved cards, the maximum. Remove one in your{' '}
                            <Link to="/profile">profile</Link> to add a different card.
                        </p>
                    )}

                    {canAddCard && !formVisible && (
                        <button type="button" className="auth-button secondary" onClick={() => setShowAddForm(true)}>
                            Add a new card
                        </button>
                    )}

                    {formVisible && (
                        <form onSubmit={handleAddCard} noValidate>
                            <fieldset>
                                <legend>Add a payment card to your profile</legend>
                                <p className="auth-intro">Fields marked with * are required.</p>

                                {addError && (
                                    <p className="form-message error" role="alert">
                                        {addError}
                                    </p>
                                )}

                                <div className="form-row">
                                    <FormField
                                        id="newCardNumber"
                                        label="Card number"
                                        required
                                        inputMode="numeric"
                                        autoComplete="cc-number"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19))
                                            clearFieldError('newCardNumber')
                                        }}
                                        error={formErrors.newCardNumber}
                                    />
                                    <FormField
                                        id="newCardExpiration"
                                        label="Expiration"
                                        required
                                        placeholder="MM/YY"
                                        autoComplete="cc-exp"
                                        value={expiration}
                                        onChange={(e) => {
                                            setExpiration(formatExpirationInput(e.target.value))
                                            clearFieldError('newCardExpiration')
                                        }}
                                        error={formErrors.newCardExpiration}
                                    />
                                </div>

                                <FormField
                                    id="newCardStreet"
                                    label="Billing street address"
                                    required
                                    maxLength={100}
                                    autoComplete="billing street-address"
                                    value={billingStreet}
                                    onChange={(e) => {
                                        setBillingStreet(e.target.value)
                                        clearFieldError('newCardStreet')
                                    }}
                                    error={formErrors.newCardStreet}
                                />
                                <div className="form-row">
                                    <FormField
                                        id="newCardCity"
                                        label="Billing city"
                                        required
                                        maxLength={60}
                                        autoComplete="billing address-level2"
                                        value={billingCity}
                                        onChange={(e) => {
                                            setBillingCity(e.target.value)
                                            clearFieldError('newCardCity')
                                        }}
                                        error={formErrors.newCardCity}
                                    />
                                    <FormField
                                        id="newCardState"
                                        label="Billing state"
                                        required
                                        maxLength={2}
                                        placeholder="GA"
                                        autoComplete="billing address-level1"
                                        value={billingState}
                                        onChange={(e) => {
                                            setBillingState(e.target.value.toUpperCase())
                                            clearFieldError('newCardState')
                                        }}
                                        error={formErrors.newCardState}
                                    />
                                </div>
                                <FormField
                                    id="newCardZip"
                                    label="Billing ZIP code"
                                    required
                                    inputMode="numeric"
                                    maxLength={5}
                                    autoComplete="billing postal-code"
                                    value={billingZip}
                                    onChange={(e) => {
                                        setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 5))
                                        clearFieldError('newCardZip')
                                    }}
                                    error={formErrors.newCardZip}
                                />

                                <button type="submit" className="auth-button" disabled={saving}>
                                    {saving ? 'Saving card...' : 'Save card to my profile'}
                                </button>
                                {cards.length > 0 && (
                                    <button
                                        type="button"
                                        className="auth-button secondary"
                                        onClick={() => {
                                            resetAddForm()
                                            setShowAddForm(false)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </fieldset>
                        </form>
                    )}

                    {notice && (
                        <p className="form-message success" role="status">
                            {notice}
                        </p>
                    )}

                    {/* Belongs to the saved-cards form above, wherever it sits on the page */}
                    <button type="submit" form="pay-form" className="auth-button">
                        Pay now
                    </button>
                </div>

                <p className="auth-links">
                    <Link to="/checkout">Back to order summary</Link>
                </p>
            </div>
        </section>
    )
}

export default PaymentPage