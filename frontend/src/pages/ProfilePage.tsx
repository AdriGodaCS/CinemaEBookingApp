import { useEffect, useState, type ChangeEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/MovieCard'
import type { Movie } from '@/types/movie'
import './AuthPages.css'
import './ProfilePage.css'

type Address = {
    street: string
    city: string
    state: string
    zipCode: string
}

type PaymentCard = {
    cardId: string
    expirationMonth: number
    expirationYear: number
    billingAddress: Address
}

type UserProfile = {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    recievePromotions: boolean
    homeAddress: Address | null
    paymentCards: PaymentCard[]
}

function ProfilePage() {
    const { user } = useAuth()
    const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    }

    const [profile, setProfile] =
        useState<UserProfile | null>(null)

    const [favorites, setFavorites] =
        useState<Movie[]>([])

    const [paymentCards, setPaymentCards] =
        useState<PaymentCard[]>([])

    const [loading, setLoading] =
        useState(true)

    const [currentPassword, setCurrentPassword] =
        useState('')

    const [newPassword, setNewPassword] =
        useState('')

    const [confirmPassword, setConfirmPassword] =
        useState('')

    const [cardNumber, setCardNumber] =
        useState('')

    const [expirationMonth, setExpirationMonth] =
        useState('')

    const [expirationYear, setExpirationYear] =
        useState('')

    const [billingStreet, setBillingStreet] =
        useState('')

    const [billingCity, setBillingCity] =
        useState('')

    const [billingState, setBillingState] =
        useState('')

    const [billingZipCode, setBillingZipCode] =
        useState('')

    type Errors = Record<string, string>

    const [errors, setErrors] =
        useState<Errors>({})

    const [successMessage,
        setSuccessMessage] =
        useState('')

    const NAME_PATTERN =
        /^\p{L}[\p{L}\s'.-]*$/u

    const PHONE_CHARS_PATTERN =
        /^[\d\s().+-]+$/

    const US_STATES = new Set([
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT',
        'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL',
        'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
        'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
        'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
        'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY',
    ])

    const PASSWORD_PATTERN =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

    useEffect(() => {
        if (!user) return

        loadProfile()
        loadFavorites()
    }, [user])

    const loadProfile = async () => {
        if (!user) return

        try {
            const response = await fetch(
                `http://localhost:8080/users/${user.id}`,
                { headers: authHeaders }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to load profile'
                )
            }

            const data = await response.json()

            if (!data.homeAddress) {
                data.homeAddress = {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                }
            }

            setProfile(data)

            setPaymentCards(
                data.paymentCards ?? []
            )
        } catch (error) {
            console.error(error)
        }
    }

    const validateProfile = () => {
        const validationErrors: Errors = {}

        if (
            !NAME_PATTERN.test(
                profile?.firstName.trim() ?? ''
            )
        ) {
            validationErrors.firstName =
                'First name can only contain letters, spaces, hyphens, and apostrophes.'
        }

        if (
            !NAME_PATTERN.test(
                profile?.lastName.trim() ?? ''
            )
        ) {
            validationErrors.lastName =
                'Last name can only contain letters, spaces, hyphens, and apostrophes.'
        }

        const phone =
            profile?.phone.trim() ?? ''

        const digits =
            phone.replace(/\D/g, '')

        if (
            !PHONE_CHARS_PATTERN.test(phone)
            || digits.length !== 10
        ) {
            validationErrors.phone =
                'Enter a valid 10-digit phone number.'
        }

        // Address validation if nonempty
        const hasAddressData =
            profile?.homeAddress &&
            (
                profile.homeAddress.street.trim() ||
                profile.homeAddress.city.trim() ||
                profile.homeAddress.state.trim() ||
                profile.homeAddress.zipCode.trim()
            )

        if (hasAddressData) {

            if (
                !profile.homeAddress?.street.trim()
            ) {
                validationErrors.street =
                    'Enter your street address.'
            }

            if (
                !profile.homeAddress?.city.trim()
            ) {
                validationErrors.city =
                    'Enter your city.'
            }

            if (
                !profile.homeAddress?.state.trim()
            ) {
                validationErrors.state =
                    'Enter a state.'
            }
            else if (
                !US_STATES.has(
                    profile.homeAddress.state
                        .trim()
                        .toUpperCase()
                )
            ) {
                validationErrors.state =
                    'Enter a valid 2-letter state code.'
            }

            if (
                !profile.homeAddress?.zipCode
                    .trim()
            ) {
                validationErrors.zipCode =
                    'Enter a ZIP code.'
            }
            else if (
                !/^\d{5}$/.test(
                    profile.homeAddress.zipCode
                )
            ) {
                validationErrors.zipCode =
                    'Enter a 5-digit ZIP code.'
            }
        }

        return validationErrors
    }

    const loadFavorites = async () => {
        if (!user) return

        try {
            const response = await fetch(
                `http://localhost:8080/users/${user.id}/favorites`,
                { headers: authHeaders }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to load favorites'
                )
            }

            const data = await response.json()

            setFavorites(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (!profile) return

        const { name, value, type, checked } =
            event.target

        setProfile({
            ...profile,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        })
    }

    const handleAddressChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (!profile) return

        setProfile({
            ...profile,
            homeAddress: {
                ...(profile.homeAddress ?? {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                }),
                [event.target.name]:
                    event.target.value,
            },
        })
    }

    const saveProfile = async () => {
        if (!profile || !user) return

        setErrors({})
        setSuccessMessage('')

        const validationErrors =
            validateProfile()

        setErrors(validationErrors)

        if (
            Object.keys(validationErrors)
                .length > 0
        ) {
            return
        }
        try {
            const response = await fetch(
                `http://localhost:8080/users/${user.id}/profile`,
                {
                    method: 'PUT',
                    headers: {
                        ...authHeaders,
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        phone: profile.phone,
                        homeAddress:
                            profile.homeAddress,
                        recievePromotions:
                            profile.recievePromotions,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to save profile'
                )
            }

            setSuccessMessage(
                'Profile updated successfully.'
            )
        } catch (error) {
            console.error(error)

            setErrors({
                server:
                    'Unable to save profile.'
            })
        }
    }

    const changePassword = async () => {
        if (!user) return

        setErrors({})
        setSuccessMessage('')

        const validationErrors: Errors =
            {}

        if (!currentPassword.trim()) {
            validationErrors.currentPassword =
                'Enter your current password.'
        }

        if (!newPassword) {
            validationErrors.newPassword =
                'Create a new password.'
        }
        else if (
            !PASSWORD_PATTERN.test(
                newPassword
            )
        ) {
            validationErrors.newPassword =
                'Use at least 8 characters with uppercase, lowercase, a number, and a special character.'
        }

        if (!confirmPassword) {
            validationErrors.confirmPassword =
                'Confirm your password.'
        }
        else if (
            confirmPassword !==
            newPassword
        ) {
            validationErrors.confirmPassword =
                'Passwords do not match.'
        }

        setErrors(validationErrors)

        if (
            Object.keys(validationErrors)
                .length > 0
        ) {
            return
        }

        try {
            const response = await fetch(
                `http://localhost:8080/users/${user.id}/password`,
                {
                    method: 'PUT',
                    headers: {
                        ...authHeaders,
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to update password'
                )
            }

            setSuccessMessage(
                'Password updated successfully.'
            )

            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            console.error(error)

            setErrors({
                currentPassword:
                    'Current password is incorrect.'
            })
        }
    }

    const validateCard = () => {
        const validationErrors: Errors = {}

        // Card number
        if (!cardNumber.trim()) {
            validationErrors.cardNumber =
                'Enter a card number.'
        } else if (
            !/^\d{13,19}$/.test(
                cardNumber.trim()
            )
        ) {
            validationErrors.cardNumber =
                'Enter a card number with 13 to 19 digits.'
        }

        // Expiration month
        const month = Number(
            expirationMonth
        )

        if (!expirationMonth) {
            validationErrors.expirationMonth =
                'Enter an expiration month.'
        } else if (
            Number.isNaN(month) ||
            month < 1 ||
            month > 12
        ) {
            validationErrors.expirationMonth =
                'Enter a month between 1 and 12.'
        }

        // Expiration year
        const year = Number(
            expirationYear
        )

        const now = new Date()

        const currentMonth =
            now.getMonth() + 1

        const currentYear =
            now.getFullYear()

        if (!expirationYear) {
            validationErrors.expirationYear =
                'Enter an expiration year.'
        } else if (
            Number.isNaN(year)
        ) {
            validationErrors.expirationYear =
                'Enter a valid expiration year.'
        } else if (
            year < currentYear
        ) {
            validationErrors.expirationYear =
                'Card is expired.'
        } else if (
            year === currentYear &&
            month < currentMonth
        ) {
            validationErrors.expirationYear =
                'Card is expired.'
        }

        // Billing street
        if (
            !billingStreet.trim()
        ) {
            validationErrors.billingStreet =
                'Enter a billing street.'
        }

        // Billing city
        if (
            !billingCity.trim()
        ) {
            validationErrors.billingCity =
                'Enter a billing city.'
        }

        // Billing state
        if (
            !billingState.trim()
        ) {
            validationErrors.billingState =
                'Enter a billing state.'
        } else if (
            !US_STATES.has(
                billingState
                    .trim()
                    .toUpperCase()
            )
        ) {
            validationErrors.billingState =
                'Enter a valid 2-letter state code.'
        }

        // Billing ZIP
        if (
            !billingZipCode.trim()
        ) {
            validationErrors.billingZipCode =
                'Enter a ZIP code.'
        } else if (
            !/^\d{5}$/.test(
                billingZipCode.trim()
            )
        ) {
            validationErrors.billingZipCode =
                'Enter a 5-digit ZIP code.'
        }

        return validationErrors
    }

    const addCard = async () => {
        if (!user) return

        setErrors({})
        setSuccessMessage('')

        const validationErrors =
            validateCard()

        setErrors(validationErrors)

        if (
            Object.keys(validationErrors)
                .length > 0
        ) {
            return
        }

        if (paymentCards.length >= 3) {
            setErrors({
                paymentCards:
                    'Maximum of 3 payment cards allowed.'
            })

            return
        }

        try {
            const response = await fetch(
                `http://localhost:8080/users/${user.id}/cards`,
                {
                    method: 'POST',
                    headers: {
                        ...authHeaders,
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        cardNumber,
                        expirationMonth:
                            Number(
                                expirationMonth
                            ),
                        expirationYear:
                            Number(
                                expirationYear
                            ),
                        billingAddress: {
                            street: billingStreet,
                            city: billingCity,
                            state: billingState,
                            zipCode:
                                billingZipCode,
                        },
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to add card'
                )
            }

            await loadProfile()

            setCardNumber('')
            setExpirationMonth('')
            setExpirationYear('')
            setBillingStreet('')
            setBillingCity('')
            setBillingState('')
            setBillingZipCode('')
        } catch (error) {
            console.error(error)
        }
    }

    const removeCard = async (
        cardId: string
    ) => {
        if (!user || !cardId) return

        try {
            const response = await fetch(
                `http://localhost:8080/users/${user.id}/cards/${cardId}`,
                {
                    method: 'DELETE',
                    headers: authHeaders,
                }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to remove card'
                )
            }

            setPaymentCards((prev) =>
                prev.filter(
                    (card) =>
                        card.cardId !== cardId
                )
            )
        } catch (error) {
            console.error(error)
        }
    }

    const removeFavorite = async (
        movieId: number
    ) => {
        if (!user) return

        try {
            const response = await fetch(
                `http://localhost:8080/users/${user.id}/favorites/${movieId}`,
                {
                    method: 'DELETE',
                    headers: authHeaders,
                }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to remove favorite'
                )
            }

            setFavorites((prev) =>
                prev.filter(
                    (movie) =>
                        movie.id !== movieId
                )
            )
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return <h2>Loading...</h2>
    }

    if (!profile) {
        return <h2>Profile not found.</h2>
    }

    return (
        <section className="auth-page">
            <div className="auth-card profile-page">
                <h1>My Profile</h1>

                {errors.server && (
                    <p
                        className="form-message error"
                        role="alert"
                    >
                        {errors.server}
                    </p>
                )}

                {successMessage && (
                    <p
                        className="form-message success"
                        role="status"
                    >
                        {successMessage}
                    </p>
                )}

                <fieldset>
                    <legend>Account Information</legend>

                    <div className="form-row">
                        <div className="form-field">
                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                aria-invalid={
                                    !!errors.firstName
                                }
                            />

                            {errors.firstName && (
                                <p className="field-error">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                aria-invalid={
                                    !!errors.lastName
                                }
                            />

                            {errors.lastName && (
                                <p className="field-error">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Email</label>

                        <input
                            type="text"
                            value={profile.email}
                            disabled
                        />
                    </div>

                    <div className="form-field">
                        <label>Phone Number</label>

                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            aria-invalid={
                                !!errors.phone
                            }
                        />

                        {errors.phone && (
                            <p className="field-error">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <label className="checkbox-field">
                        <input
                            type="checkbox"
                            name="recievePromotions"
                            checked={
                                profile.recievePromotions
                            }
                            onChange={handleChange}
                        />
                        Receive Promotions
                    </label>
                </fieldset>

                <fieldset>
                    <legend>
                        Change Password
                    </legend>

                    <div className="form-field">
                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            aria-invalid={
                                !!errors.currentPassword
                            }
                        />

                        {errors.currentPassword && (
                            <p className="field-error">
                                {errors.currentPassword}
                            </p>
                        )}
                    </div>

                    <div className="form-field">
                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            aria-invalid={
                                !!errors.newPassword
                            }
                        />

                        <p className="field-hint">
                            At least 8 characters
                            with uppercase,
                            lowercase, a number,
                            and a special character.
                        </p>

                        {errors.newPassword && (
                            <p className="field-error">
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    <div className="form-field">
                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            aria-invalid={
                                !!errors.confirmPassword
                            }
                        />

                        {errors.confirmPassword && (
                            <p className="field-error">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        className="auth-button"
                        onClick={changePassword}
                    >
                        Change Password
                    </button>
                </fieldset>

                <fieldset>
                    <legend>Home Address</legend>

                    <div className="form-field">
                        <label>Street</label>

                        <input
                            type="text"
                            name="street"
                            value={
                                profile.homeAddress?.street ?? ''
                            }
                            onChange={handleAddressChange}
                            aria-invalid={
                                !!errors.street
                            }
                        />

                        {errors.street && (
                            <p className="field-error">
                                {errors.street}
                            </p>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                value={
                                    profile.homeAddress?.city ?? ''
                                }
                                onChange={handleAddressChange}
                                aria-invalid={
                                    !!errors.city
                                }
                            />

                            {errors.city && (
                                <p className="field-error">
                                    {errors.city}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>State</label>

                            <input
                                type="text"
                                name="state"
                                value={
                                    profile.homeAddress?.state ?? ''
                                }
                                onChange={handleAddressChange}
                                aria-invalid={
                                    !!errors.state
                                }
                            />

                            {errors.state && (
                                <p className="field-error">
                                    {errors.state}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="form-field">
                        <label>ZIP Code</label>

                        <input
                            type="text"
                            name="zipCode"
                            value={
                                profile.homeAddress?.zipCode ?? ''
                            }
                            onChange={handleAddressChange}
                            aria-invalid={
                                !!errors.zipCode
                            }
                        />

                        {errors.zipCode && (
                            <p className="field-error">
                                {errors.zipCode}
                            </p>
                        )}
                    </div>
                </fieldset>

                <button
                    className="auth-button"
                    onClick={saveProfile}
                >
                    Save Changes
                </button>

                <fieldset>
                    <legend>Payment Cards</legend>

                    {errors.paymentCards && (
                        <p className="field-error">
                            {errors.paymentCards}
                        </p>
                    )}

                    {paymentCards.length === 0 ? (
                        <p>No payment cards saved.</p>
                    ) : (
                        paymentCards.map((card) => (
                            <div
                                key={card.cardId}
                                className="form-field"
                            >
                                <div className="card-entry-header">
                                    <h3>
                                        Card ending in ****
                                    </h3>

                                    <button
                                        type="button"
                                        className="auth-button secondary"
                                        onClick={() =>
                                            removeCard(
                                                card.cardId
                                            )
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>

                                <p>
                                    Expires:{' '}
                                    {card.expirationMonth}/
                                    {card.expirationYear}
                                </p>

                                <p>
                                    {
                                        card.billingAddress
                                            .street
                                    }
                                </p>

                                <p>
                                    {
                                        card.billingAddress
                                            .city
                                    }
                                    ,{' '}
                                    {
                                        card.billingAddress
                                            .state
                                    }{' '}
                                    {
                                        card.billingAddress
                                            .zipCode
                                    }
                                </p>
                            </div>
                        ))
                    )}

                    {paymentCards.length < 3 && (
                        <>
                            <h3>Add Payment Card</h3>

                            <div className="form-field">
                                <label>
                                    Card Number
                                </label>

                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) =>
                                        setCardNumber(
                                            e.target.value
                                        )
                                    }
                                    aria-invalid={
                                        !!errors.cardNumber
                                    }
                                />

                                {errors.cardNumber && (
                                    <p className="field-error">
                                        {
                                            errors.cardNumber
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>
                                        Expiration Month
                                    </label>

                                    <input
                                        type="number"
                                        value={
                                            expirationMonth
                                        }
                                        onChange={(e) =>
                                            setExpirationMonth(
                                                e.target.value
                                            )
                                        }
                                        aria-invalid={
                                            !!errors.expirationMonth
                                        }
                                    />

                                    {errors.expirationMonth && (
                                        <p className="field-error">
                                            {
                                                errors.expirationMonth
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label>
                                        Expiration Year
                                    </label>

                                    <input
                                        type="number"
                                        value={
                                            expirationYear
                                        }
                                        onChange={(e) =>
                                            setExpirationYear(
                                                e.target.value
                                            )
                                        }
                                        aria-invalid={
                                            !!errors.expirationYear
                                        }
                                    />

                                    {errors.expirationYear && (
                                        <p className="field-error">
                                            {
                                                errors.expirationYear
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="form-field">
                                <label>
                                    Billing Street
                                </label>

                                <input
                                    type="text"
                                    value={
                                        billingStreet
                                    }
                                    onChange={(e) =>
                                        setBillingStreet(
                                            e.target.value
                                        )
                                    }
                                    aria-invalid={
                                        !!errors.billingStreet
                                    }
                                />

                                {errors.billingStreet && (
                                    <p className="field-error">
                                        {
                                            errors.billingStreet
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>
                                        Billing City
                                    </label>

                                    <input
                                        type="text"
                                        value={billingCity}
                                        onChange={(e) =>
                                            setBillingCity(
                                                e.target.value
                                            )
                                        }
                                        aria-invalid={
                                            !!errors.billingCity
                                        }
                                    />

                                    {errors.billingCity && (
                                        <p className="field-error">
                                            {
                                                errors.billingCity
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label>
                                        Billing State
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            billingState
                                        }
                                        onChange={(e) =>
                                            setBillingState(
                                                e.target.value
                                            )
                                        }
                                        aria-invalid={
                                            !!errors.billingState
                                        }
                                    />

                                    {errors.billingState && (
                                        <p className="field-error">
                                            {
                                                errors.billingState
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="form-field">
                                <label>
                                    Billing ZIP Code
                                </label>

                                <input
                                    type="text"
                                    value={
                                        billingZipCode
                                    }
                                    onChange={(e) =>
                                        setBillingZipCode(
                                            e.target.value
                                        )
                                    }
                                    aria-invalid={
                                        !!errors.billingZipCode
                                    }
                                />

                                {errors.billingZipCode && (
                                    <p className="field-error">
                                        {
                                            errors.billingZipCode
                                        }
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                className="auth-button"
                                onClick={addCard}
                            >
                                Add Card
                            </button>
                        </>
                    )}
                </fieldset>

                <section className="favorites-section">
                    <h2>Favorite Movies</h2>

                    {favorites.length === 0 ? (
                        <p>You have no favorite movies.</p>
                    ) : (
                        <div className="favorites-grid">
                            {favorites.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="favorite-movie"
                                >
                                    <MovieCard
                                        id={movie.id}
                                        poster_url={movie.posterUrl}
                                        title={movie.title}
                                        genre={movie.genre}
                                        rating={movie.rating}
                                        showFavoriteButton={false}
                                    />

                                    <button
                                        className="remove-favorite-btn"
                                        onClick={() =>
                                            removeFavorite(movie.id)
                                        }
                                    >
                                        Remove Favorite
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </section>
    )
}

export default ProfilePage