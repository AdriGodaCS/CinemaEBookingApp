import { useEffect, useState, type ChangeEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/MovieCard'
import type { Movie } from '@/types/movie'
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

            alert(
                'Profile updated successfully.'
            )
        } catch (error) {
            console.error(error)

            alert(
                'Unable to save profile.'
            )
        }
    }

    const changePassword = async () => {
        if (!user) return

        if (newPassword !== confirmPassword) {
            alert(
                'New passwords do not match.'
            )
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

            alert(
                'Password updated successfully.'
            )

            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            console.error(error)

            alert(
                'Current password is incorrect.'
            )
        }
    }

    const addCard = async () => {
        if (!user) return

        if (paymentCards.length >= 3) {
            alert(
                'Maximum 3 payment cards allowed.'
            )
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
        <div className="profile-page">
            <h1>My Profile</h1>

            <section className="profile-section">
                <h2>Account Information</h2>

                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                />

                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                />

                <label>Email</label>
                <input
                    type="text"
                    value={profile.email}
                    disabled
                />

                <label>Phone Number</label>
                <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                />

                <label>
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
            </section>

            <section className="profile-section">
                <h2>Change Password</h2>

                <label>Current Password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                            e.target.value
                        )
                    }
                />

                <label>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                />

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
                />

                <button
                    type="button"
                    onClick={changePassword}
                >
                    Change Password
                </button>
            </section>

            <section className="profile-section">
                <h2>Home Address</h2>

                <label>Street</label>
                <input
                    type="text"
                    name="street"
                    value={
                        profile.homeAddress
                            ?.street ?? ''
                    }
                    onChange={
                        handleAddressChange
                    }
                />

                <label>City</label>
                <input
                    type="text"
                    name="city"
                    value={
                        profile.homeAddress?.city ??
                        ''
                    }
                    onChange={
                        handleAddressChange
                    }
                />

                <label>State</label>
                <input
                    type="text"
                    name="state"
                    value={
                        profile.homeAddress?.state ??
                        ''
                    }
                    onChange={
                        handleAddressChange
                    }
                />

                <label>Zip Code</label>
                <input
                    type="text"
                    name="zipCode"
                    value={
                        profile.homeAddress
                            ?.zipCode ?? ''
                    }
                    onChange={
                        handleAddressChange
                    }
                />
            </section>

            <button
                className="save-profile-btn"
                onClick={saveProfile}
            >
                Save Changes
            </button>

            <section className="profile-section">
                <h2>Payment Cards</h2>

                {paymentCards.length === 0 ? (
                    <p>No payment cards saved.</p>
                ) : (
                    <div className="payment-cards-list">
                        {paymentCards.map((card) => (
                            <div
                                key={card.cardId}
                                className="payment-card"
                            >
                                <p>Payment Card</p>

                                <p>
                                    Expires:{' '}
                                    {card.expirationMonth}/
                                    {card.expirationYear}
                                </p>

                                <p>{card.billingAddress.street}</p>

                                <p>
                                    {card.billingAddress.city},{' '}
                                    {card.billingAddress.state}{' '}
                                    {card.billingAddress.zipCode}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeCard(card.cardId)
                                    }
                                >
                                    Remove Card
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {paymentCards.length < 3 && (
                    <>
                        <h3>Add Payment Card</h3>

                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) =>
                                setCardNumber(e.target.value)
                            }
                        />

                        <input
                            type="number"
                            placeholder="Expiration Month"
                            value={expirationMonth}
                            onChange={(e) =>
                                setExpirationMonth(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            type="number"
                            placeholder="Expiration Year"
                            value={expirationYear}
                            onChange={(e) =>
                                setExpirationYear(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            type="text"
                            placeholder="Billing Street"
                            value={billingStreet}
                            onChange={(e) =>
                                setBillingStreet(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            type="text"
                            placeholder="Billing City"
                            value={billingCity}
                            onChange={(e) =>
                                setBillingCity(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            type="text"
                            placeholder="Billing State"
                            value={billingState}
                            onChange={(e) =>
                                setBillingState(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            type="text"
                            placeholder="Billing Zip Code"
                            value={billingZipCode}
                            onChange={(e) =>
                                setBillingZipCode(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            type="button"
                            onClick={addCard}
                        >
                            Add Card
                        </button>
                    </>
                )}
            </section>

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
    )
}

export default ProfilePage