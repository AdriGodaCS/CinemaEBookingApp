import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../components/FormField'
import './AuthPages.css'

const API_URL = 'http://localhost:8080'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [sentTo, setSentTo] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormError('')

        const trimmed = email.trim()
        if (!trimmed) {
            setFieldError('Enter your email address.')
            return
        }
        if (!EMAIL_PATTERN.test(trimmed)) {
            setFieldError('Enter a valid email address, like name@example.com.')
            return
        }
        setFieldError('')

        setSubmitting(true)
        try {
            // TODO (backend): this public endpoint does not exist yet. It must look the user up by email,
            // save a reset token, and send the reset email, returning 200 whether or not the email exists.
            const response = await fetch(`${API_URL}/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmed.toLowerCase() }),
            })

            if (!response.ok) setFormError('We could not send the reset email. Please try again.')
            else setSentTo(trimmed)
        } catch {
            setFormError('Unable to reach the server. Check your connection and try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (sentTo) {
        return (
            <section className="auth-page" aria-labelledby="forgot-sent-title">
                <div className="auth-card">
                    <h1 id="forgot-sent-title">Check your email</h1>
                    <p className="form-message success" role="status">
                        If an account exists for {sentTo}, we sent a link to reset your password.
                    </p>
                    <p className="auth-intro">The email can take a minute to arrive. Check your spam folder if you do not see it.</p>
                    <Link className="auth-button" to="/login">
                        Back to log in
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section className="auth-page" aria-labelledby="forgot-title">
            <div className="auth-card">
                <h1 id="forgot-title">Forgot your password?</h1>
                <p className="auth-intro">Enter the email for your account and we will send you a link to reset your password.</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {formError && (
                        <p className="form-message error" role="alert">
                            {formError}
                        </p>
                    )}

                    <FormField id="email" name="email" type="email" label="Email" required autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setFieldError('')
                        }}
                        error={fieldError} />

                    <button type="submit" className="auth-button" disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>

                <p className="auth-links">
                    <Link to="/login">Back to log in</Link>
                </p>
            </div>
        </section>
    )
}

export default ForgotPasswordPage