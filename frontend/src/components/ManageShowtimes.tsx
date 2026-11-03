import { useEffect, useState } from 'react'
import './ManageShowtimes.css'

type Movie = {
    id: number
    title: string
}

type Showroom = {
    id: number
    name: string
}

type ManageShowtimesProps = {}

function ManageShowtimes(
    { }: ManageShowtimesProps
) {
    const [movies, setMovies] =
        useState<Movie[]>([])

    const [showrooms, setShowrooms] =
        useState<Showroom[]>([])

    const [selectedMovie,
        setSelectedMovie] =
        useState<Movie | null>(null)

    const [showDate,
        setShowDate] =
        useState('')

    const [showroomId,
        setShowroomId] =
        useState('')

    const [availableTimeslots,
        setAvailableTimeslots] =
        useState<string[]>([])

    const [showTime,
        setShowTime] =
        useState('')

    const [message,
        setMessage] =
        useState('')

    useEffect(() => {
        loadMovies()
        loadShowrooms()
    }, [])

    const loadMovies =
        async () => {

            const response =
                await fetch(
                    'http://localhost:8080/movies'
                )

            if (!response.ok) {
                return
            }

            const data =
                await response.json()

            setMovies(data)
        }

    const loadShowrooms =
        async () => {

            const response =
                await fetch(
                    'http://localhost:8080/showrooms'
                )

            if (!response.ok) {
                return
            }

            const data =
                await response.json()

            setShowrooms(data)
        }

    const getAvailableTimesForDate = (
        times: string[]
    ) => {

        if (!showDate) {
            return times
        }

        const now = new Date()

        const today =
            now
                .toISOString()
                .split('T')[0]

        if (showDate !== today) {
            return times
        }

        const currentMinutes =
            now.getHours() * 60 +
            now.getMinutes()

        return times.filter(time => { // Filter available times to times that are > the current time if the date is today

            const [hours, minutes] =
                time.split(':').map(Number)

            const timeMinutes =
                hours * 60 + minutes

            return (
                timeMinutes >
                currentMinutes
            )
        })
    }

    const loadAvailableTimeslots =
        async (
            selectedDate: string,
            selectedShowroomId: number
        ) => {

            const response =
                await fetch(
                    `http://localhost:8080/shows/available-timeslots?showDate=${selectedDate}&showroomId=${selectedShowroomId}`
                )

            if (!response.ok) {
                return
            }

            const data =
                await response.json()

            setAvailableTimeslots(data)
        }

    const createShowtime =
        async () => {

            if (
                !selectedMovie ||
                !showDate ||
                !showroomId ||
                !showTime
            ) {

                setMessage(
                    'Please complete all fields.'
                )

                return
            }

            try {

                const response =
                    await fetch(
                        'http://localhost:8080/shows',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                Authorization:
                                    `Bearer ${localStorage.getItem(
                                        'token'
                                    ) ?? ''
                                    }`,
                            },

                            body: JSON.stringify({
                                movieId:
                                    selectedMovie.id,
                                showroomId:
                                    Number(
                                        showroomId
                                    ),
                                showDate,
                                showTime,

                            }),
                        }
                    )

                const data =
                    await response.json()

                if (!response.ok) {

                    setMessage(
                        data.message ??
                        'Failed to create showtime.'
                    )

                    return
                }

                setMessage(
                    'Showtime created successfully.'
                )

                setShowDate('')
                setShowroomId('')
                setShowTime('')
                setAvailableTimeslots([])

            } catch (error) {

                console.error(error)

                setMessage(
                    'Unable to create showtime.'
                )
            }
        }

    return (
        <div className="showtime-management">

            <h2>
                Manage Showtimes
            </h2>

            <div className="showtime-container">
                <div className="showtime-layout">
                    <div className="showtime-movie-list">

                        {movies.map(movie => (

                            <div
                                key={movie.id}
                                className="showtime-movie-card"
                            >
                                <h3 className="showtime-movie-title">
                                    {movie.title}
                                </h3>

                                <button
                                    className="auth-button"
                                    onClick={() => {
                                        setSelectedMovie(movie)

                                        setMessage('')
                                        setShowDate('')
                                        setShowroomId('')
                                        setShowTime('')
                                        setAvailableTimeslots([])
                                    }}
                                >
                                    Add Showtime
                                </button>
                            </div>

                        ))}

                    </div>
                    {selectedMovie && (

                        <div className="movie-form">

                            <h3>
                                Add Showtime
                                {' '}
                                for
                                {' '}
                                {selectedMovie.title}
                            </h3>

                            {message && (
                                <p className="form-message">
                                    {message}
                                </p>
                            )}

                            <div className="form-field">

                                <label>
                                    Date *
                                </label>

                                <input
                                    type="date"
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                    value={showDate}
                                    onChange={(e) => {

                                        setShowDate(
                                            e.target.value
                                        )

                                        setShowroomId('')
                                        setShowTime('')
                                        setAvailableTimeslots([])
                                    }}
                                />

                            </div>

                            {showDate && (
                                <div className="form-field">

                                    <label>
                                        Showroom *
                                    </label>

                                    <select
                                        value={showroomId}
                                        onChange={async (
                                            e
                                        ) => {

                                            const value = e.target.value

                                            setShowroomId(
                                                value
                                            )

                                            setShowTime('')

                                            if (
                                                value
                                            ) {
                                                await loadAvailableTimeslots(
                                                    showDate,
                                                    Number(
                                                        value
                                                    )
                                                )
                                            }
                                        }}
                                    >
                                        <option value="">
                                            Select Showroom
                                        </option>

                                        {showrooms.map(
                                            showroom => (

                                                <option
                                                    key={
                                                        showroom.id
                                                    }
                                                    value={
                                                        showroom.id
                                                    }
                                                >
                                                    {
                                                        showroom.name
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>
                            )}

                            {showroomId && (

                                <div className="form-field">

                                    <label>
                                        Available Times *
                                    </label>

                                    <select
                                        value={showTime}
                                        onChange={(
                                            e
                                        ) =>
                                            setShowTime(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select Time
                                        </option>

                                        {getAvailableTimesForDate(
                                            availableTimeslots
                                        ).map(
                                            time => (

                                                <option
                                                    key={time}
                                                    value={time}
                                                >
                                                    {time}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    {
                                        getAvailableTimesForDate(
                                            availableTimeslots
                                        ).length === 0 && (
                                            <p className="field-error">
                                                No future timeslots remain for
                                                today.
                                            </p>
                                        )
                                    }

                                </div>
                            )}

                            <button
                                className="movie-submit-button"
                                onClick={createShowtime}
                            >
                                Create Showtime
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageShowtimes