import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'
import type { User } from '../context/AuthContext'
import './AuthPages.css'

const API_URL = 'http://localhost:8080'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const UNVERIFIED_MESSAGE = 'Account is not verified. Please check your email to verify your account.'

function LoginPage() {
    const { setUser, isLoggedIn, isAdmin, loading } = useAuth()
    const location = useLocation()
    const [searchParams] = useSearchParams()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // Page the user was trying to reach before being sent here (set by ProtectedRoute, if it passes it)
    const from = (location.state as { from?: string } | null)?.from

    // Role-based redirect: runs after login, and also for anyone who is already logged in
    if (!loading && isLoggedIn) {
        return <Navigate to={isAdmin ? '/admin' : (from ?? '/')} replace />
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormError('')

        const nextErrors: { email?: string; password?: string } = {}
        if (!email.trim()) nextErrors.email = 'Enter your email address.'
        else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address, like name@example.com.'
        if (!password) nextErrors.password = 'Enter your password.'
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) return

        setSubmitting(true)
        try {
            // TODO: confirm the login path and error status codes with Jacob (controller not seen yet)
            // UserController is mapped to /users, so login belongs at /users/login (endpoint still needs to be added)
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
            })

            // Assumed contract: 401 = wrong email/password, 403 = account not verified (INACTIVE)
            if (response.status === 401) {
                setFormError('Incorrect email or password. Please try again.')
                return
            }
            if (response.status === 403) {
                const data = await response.json().catch(() => null)
                setFormError(data?.message ?? UNVERIFIED_MESSAGE)
                return
            }
            if (!response.ok) {
                const data = await response.json().catch(() => null)
                setFormError(data?.message ?? 'We could not log you in. Please try again.')
                return
            }

            // Backend LoginResponse: { token, tokenType, user: LoggedInUserData }
            const data: { token: string; user: User & { status?: string } } = await response.json()

            // The backend currently issues a token even for INACTIVE accounts, so block them here too.
            // Check this BEFORE saving the token so an unverified user is never "logged in".
            if (data.user.status === 'INACTIVE') {
                setFormError(UNVERIFIED_MESSAGE)
                return
            }

            localStorage.setItem('token', data.token)

            // Setting the user triggers the <Navigate> above, which picks the page by role
            setUser(data.user)
        } catch {
            setFormError('Unable to reach the server. Check your connection and try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="auth-page" aria-labelledby="login-title">
            <div className="auth-card">
                <h1 id="login-title">Log in</h1>
                <p className="auth-intro">Fields marked with * are required.</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {searchParams.get('verified') === 'true' && (
                        <p className="form-message success" role="status">
                            Your account is verified. Log in to continue.
                        </p>
                    )}
                    {formError && (
                        <p className="form-message error" role="alert">
                            {formError}
                        </p>
                    )}

                    <FormField id="email" name="email" type="email" label="Email" required autoComplete="email"
                        value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }}
                        error={errors.email} />
                    <FormField id="password" name="password" type="password" label="Password" required autoComplete="current-password"
                        value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
                        error={errors.password} />

                    <button type="submit" className="auth-button" disabled={submitting}>
                        {submitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p className="auth-links">
                    <Link to="/forgot-password">Forgot your password?</Link>
                    <span>
                        New here? <Link to="/signup">Create an account</Link>
                    </span>
                </p>
            </div>
        </section>
    )
}

export default LoginPage