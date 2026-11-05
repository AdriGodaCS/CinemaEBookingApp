import { backendFacade } from '../services/BackendFacade'
import { useEffect, useRef, useState } from 'react'
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

    const [
        availableShowroomIds,
        setAvailableShowroomIds
    ] = useState<number[]>([])

    const [
        loadingShowrooms,
        setLoadingShowrooms
    ] = useState(true)

    const [
        loadingShowtimes,
        setLoadingShowtimes
    ] = useState(true);

    const formRef =
        useRef<HTMLDivElement>(null)

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

            const movies = await backendFacade.getAllMovies() as Movie[]
            setMovies(movies)
        }

    const loadAvailableShowrooms =
        async (date: string) => {

            setLoadingShowrooms(true)

            try {

                const showrooms =
                    await backendFacade.getAvailableShowrooms(date) as number[]
                setAvailableShowroomIds(showrooms)

            } finally {

                setLoadingShowrooms(false)
            }
        }

    const loadShowrooms =
        async () => {

            const showrooms = await backendFacade.getAllShowrooms() as Showroom[]
            setShowrooms(showrooms)
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
            try {
                const timeslots =
                    await backendFacade.getAvailableTimeslots(
                        selectedDate,
                        selectedShowroomId
                    ) as string[]
                setAvailableTimeslots(timeslots)
            } finally {
                setLoadingShowtimes(false);
            }
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

                await backendFacade.createShow({
                                movieId:
                                    selectedMovie.id,
                                showroomId:
                                    Number(
                                        showroomId
                                    ),
                                showDate,
                                showTime,

                            })

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

                                        setTimeout(() => {
                                            formRef.current?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            })
                                        }, 0)

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

                        <div ref={formRef} className="movie-form">

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

                            <div className="showtime-field">

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
                                    onChange={async (e) => {
                                        const date =
                                            e.target.value

                                        setShowDate(date)

                                        setShowroomId('')
                                        setShowTime('')
                                        setAvailableTimeslots([])
                                        setLoadingShowrooms(true)

                                        await loadAvailableShowrooms(
                                            date
                                        )
                                    }}
                                />

                            </div>

                            {
                                showDate &&
                                !loadingShowrooms &&
                                availableShowroomIds.length === 0 && (
                                    <p className="field-error">
                                        No showrooms have available
                                        timeslots for this date.
                                    </p>
                                )
                            }

                            {showDate && (
                                <div className="form-field">

                                    <label>
                                        Available Showrooms *
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

                                            if (value) {
                                                setLoadingShowtimes(true)
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

                                        {showrooms
                                            .filter(showroom =>
                                                availableShowroomIds.includes(
                                                    showroom.id
                                                )
                                            )
                                            .map(showroom => (

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

                            {showroomId &&                            
                                (

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
                                            ).length === 0 && !loadingShowtimes && (
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