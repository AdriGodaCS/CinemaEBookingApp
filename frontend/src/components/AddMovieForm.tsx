import { backendFacade } from '../services/BackendFacade'
import { useState } from 'react'
import './AddMovieForm.css'

type AddMovieFormProps = {
    onSuccess?: () => void
}

function AddMovieForm({
    onSuccess,
}: AddMovieFormProps) {
    const [message, setMessage] =
        useState('')

    type Errors = Record<string, string>

    const [errors, setErrors] =
        useState<Errors>({})

    const [formData, setFormData] =
        useState({
            title: '',
            rating: '',
            genre: '',
            description: '',
            posterUrl: '',
            trailerUrl: '',
            director: '',
            directorImageUrl: '',
            producer: '',
            producerImageUrl: '',
            movieCast: '',
            movieCastImageUrls: '',
            reviews: '',
        })

    const validateForm = () => {
        const validationErrors: Errors = {}

        if (!formData.title.trim()) {
            validationErrors.title =
                'Title is required.'
        }

        if (!formData.genre.trim()) {
            validationErrors.genre =
                'Genre is required.'
        }

        if (!formData.rating.trim()) {
            validationErrors.rating =
                'Rating is required.'
        }
        else if (
            ![
                'G',
                'PG',
                'PG-13',
                'R',
                'NC-17',
            ].includes(formData.rating)
        ) {
            validationErrors.rating =
                'Select a valid rating.'
        }

        if (!formData.description.trim()) {
            validationErrors.description =
                'Description is required.'
        }
        else if (
            formData.description.trim().length <
            20
        ) {
            validationErrors.description =
                'Description must be at least 20 characters.'
        }

        if (!formData.posterUrl.trim()) {
            validationErrors.posterUrl =
                'Poster URL is required.'
        }
        else {
            try {
                new URL(
                    formData.posterUrl
                )
            } catch {
                validationErrors.posterUrl =
                    'Enter a valid URL.'
            }
        }

        if (!formData.trailerUrl.trim()) {
            validationErrors.trailerUrl =
                'Trailer URL is required.'
        }
        else {
            try {
                new URL(
                    formData.trailerUrl
                )
            } catch {
                validationErrors.trailerUrl =
                    'Enter a valid URL.'
            }
        }

        if (!formData.director.trim()) {
            validationErrors.director =
                'Director is required.'
        }

        if (!formData.producer.trim()) {
            validationErrors.producer =
                'Producer is required.'
        }

        const cast =
            formData.movieCast
                .split(',')
                .map((member) =>
                    member.trim()
                )
                .filter(Boolean)

        if (cast.length === 0) {
            validationErrors.movieCast =
                'At least one cast member is required.'
        }

        if (
            formData.directorImageUrl.trim()
        ) {
            try {
                new URL(
                    formData.directorImageUrl
                )
            } catch {
                validationErrors.directorImageUrl =
                    'Enter a valid image URL.'
            }
        }

        if (
            formData.producerImageUrl.trim()
        ) {
            try {
                new URL(
                    formData.producerImageUrl
                )
            } catch {
                validationErrors.producerImageUrl =
                    'Enter a valid image URL.'
            }
        }

        const imageUrls =
            formData.movieCastImageUrls
                .split(',')
                .map((url) =>
                    url.trim()
                )
                .filter(Boolean)

        for (const url of imageUrls) {
            try {
                new URL(url)
            } catch {
                validationErrors.movieCastImageUrls =
                    'One or more cast image URLs are invalid.'
                break
            }
        }

        return validationErrors
    }

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        })
    }

    const handleSubmit =
        async (
            e: React.FormEvent
        ) => {
            e.preventDefault()

            setErrors({})
            setMessage("");

            const validationErrors =
                validateForm()

            setErrors(validationErrors)

            if (
                Object.keys(
                    validationErrors
                ).length > 0
            ) {
                return
            }

            try {
                const response =
                    await backendFacade.createMovie({
                                title:
                                    formData.title,
                                rating:
                                    formData.rating,
                                genre:
                                    formData.genre,
                                description:
                                    formData.description,
                                posterUrl:
                                    formData.posterUrl,
                                trailerUrl:
                                    formData.trailerUrl,
                                director:
                                    formData.director,
                                directorImageUrl:
                                    formData.directorImageUrl ||
                                    null,
                                producer:
                                    formData.producer,
                                producerImageUrl:
                                    formData.producerImageUrl ||
                                    null,
                                movieCast:
                                    formData.movieCast
                                        .split(',')
                                        .map(
                                            (
                                                cast
                                            ) =>
                                                cast.trim()
                                        )
                                        .filter(
                                            Boolean
                                        ),
                                movieCastImageUrls:
                                    formData.movieCastImageUrls
                                        .split(',')
                                        .map(
                                            (
                                                url
                                            ) =>
                                                url.trim()
                                        )
                                        .filter(
                                            Boolean
                                        ),
                                reviews:
                                    formData.reviews
                                        .split(',')
                                        .map((review) =>
                                            review.trim()
                                        )
                                        .filter(Boolean),
                            })

                const data =
                    await response.json()

                if (
                    !response.ok
                ) {
                    setMessage(
                        data.message ??
                        'Failed to create movie.'
                    )
                    return
                }

                setMessage(
                    'Movie created successfully.'
                )

                setFormData({
                    title: '',
                    rating: '',
                    genre: '',
                    description: '',
                    posterUrl: '',
                    trailerUrl: '',
                    director: '',
                    directorImageUrl:
                        '',
                    producer: '',
                    producerImageUrl:
                        '',
                    movieCast: '',
                    movieCastImageUrls:
                        '',
                    reviews: '',
                })

                onSuccess?.()
            } catch (error) {
                console.error(error)

                setMessage(
                    'Unable to create movie.'
                )
            }
        }

    return (
        <form className="movie-form" onSubmit={handleSubmit}>
            <h2>Add Movie</h2>

            <div className="form-field">
                <label>
                    Title *
                </label>

                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    aria-invalid={
                        !!errors.title
                    }
                />

                {errors.title && (
                    <p className="field-error">
                        {errors.title}
                    </p>
                )}
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label>Genre *</label>

                    <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        aria-invalid={!!errors.genre}
                    >
                        <option value="">
                            Select Genre
                        </option>

                        <option>Action</option>
                        <option>Adventure</option>
                        <option>Animation</option>
                        <option>Comedy</option>
                        <option>Crime</option>
                        <option>Drama</option>
                        <option>Fantasy</option>
                        <option>Horror</option>
                        <option>Mystery</option>
                        <option>Romance</option>
                        <option>Sci-Fi</option>
                        <option>Thriller</option>
                    </select>
                    {errors.genre && (
                        <p className="field-error">
                            {errors.genre}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label>Rating *</label>

                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        aria-invalid={!!errors.rating}
                    >
                        <option value="">
                            Select Rating
                        </option>

                        <option>G</option>
                        <option>PG</option>
                        <option>PG-13</option>
                        <option>R</option>
                        <option>NC-17</option>
                    </select>
                    {errors.rating && (
                        <p className="field-error">
                            {errors.rating}
                        </p>
                    )}
                </div>
            </div>

            <div className="form-field">
                <label>Description *</label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    aria-invalid={
                        !!errors.description
                    }
                />
                {errors.description && (
                    <p className="field-error">
                        {errors.description}
                    </p>
                )}
            </div>

            <div className="form-field">
                <label>Poster URL *</label>

                <input
                    name="posterUrl"
                    value={formData.posterUrl}
                    onChange={handleChange}
                    aria-invalid={!!errors.posterUrl}
                />
                {errors.posterUrl && (
                    <p className="field-error">
                        {errors.posterUrl}
                    </p>
                )}
            </div>

            <div className="form-field">
                <label>Trailer URL *</label>

                <input
                    name="trailerUrl"
                    value={formData.trailerUrl}
                    onChange={handleChange}
                    aria-invalid={!!errors.trailerUrl}
                />
                {errors.trailerUrl && (
                    <p className="field-error">
                        {errors.trailerUrl}
                    </p>
                )}

            </div>

            <div className="form-row">
                <div className="form-field">
                    <label>Director *</label>

                    <input
                        name="director"
                        value={formData.director}
                        onChange={handleChange}
                        aria-invalid={!!errors.director}
                    />
                    {errors.director && (
                        <p className="field-error">
                            {errors.director}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label>Director Image URL</label>

                    <input
                        name="directorImageUrl"
                        value={formData.directorImageUrl}
                        onChange={handleChange}
                        aria-invalid={!!errors.directorImageUrl}
                    />
                    {errors.directorImageUrl && (
                        <p className="field-error">
                            {errors.directorImageUrl}
                        </p>
                    )}
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label>Producer *</label>

                    <input
                        name="producer"
                        value={formData.producer}
                        onChange={handleChange}
                        aria-invalid={!!errors.producer}
                    />
                    {errors.producer && (
                        <p className="field-error">
                            {errors.producer}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label>Producer Image URL</label>

                    <input
                        name="producerImageUrl"
                        value={formData.producerImageUrl}
                        onChange={handleChange}
                        aria-invalid={!!errors.producerImageUrl}
                    />
                    {errors.producerImageUrl && (
                        <p className="field-error">
                            {errors.producerImageUrl}
                        </p>
                    )}
                </div>
            </div>

            <div className="form-field">
                <label>
                    Cast *
                </label>

                <textarea
                    name="movieCast"
                    placeholder="Actor 1, Actor 2, Actor 3"
                    value={formData.movieCast}
                    onChange={handleChange}
                    aria-invalid={!!errors.movieCast}
                />
                {errors.movieCast && (
                    <p className="field-error">
                        {errors.movieCast}
                    </p>
                )}
            </div>

            <div className="form-field">
                <label>
                    Cast Image URLs
                </label>

                <textarea
                    name="movieCastImageUrls"
                    placeholder="url1, url2, url3"
                    value={formData.movieCastImageUrls}
                    onChange={handleChange}
                    aria-invalid={!!errors.movieCastImageUrls}
                />
                {errors.movieCastImageUrls && (
                    <p className="field-error">
                        {errors.movieCastImageUrls}
                    </p>
                )}
            </div>

            <div className="form-field">
                <label>
                    Reviews
                </label>

                <textarea
                    name="reviews"
                    placeholder="Review 1, Review 2, Review 3"
                    value={formData.reviews}
                    onChange={handleChange}
                    aria-invalid={!!errors.reviews}
                />

                {errors.reviews && (
                    <p className="field-error">
                        {errors.reviews}
                    </p>
                )}
            </div>


            {message && (
                <p
                    className={
                        message.includes('success')
                            ? 'success-message'
                            : 'error-message'
                    }
                >
                    {message}
                </p>
            )}

            <button
                type="submit"
                className="movie-submit-button"
            >
                Add Movie
            </button>
        </form>
    )
}

export default AddMovieForm