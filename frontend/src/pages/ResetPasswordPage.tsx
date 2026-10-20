import { useEffect, useState } from 'react'
import {
    useSearchParams,
    useNavigate,
} from 'react-router-dom'
import './ResetPasswordPage.css'
import './AuthPages.css'

function ResetPasswordPage() {
    const [searchParams] =
        useSearchParams()

    const navigate =
        useNavigate()

    const PASSWORD_PATTERN =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

    const [validToken, setValidToken] =
        useState<boolean | null>(null)

    const [newPassword, setNewPassword] =
        useState('')

    const [errors, setErrors] =
        useState<{
            newPassword?: string
            confirmPassword?: string
        }>({})

    const [confirmPassword, setConfirmPassword] =
        useState('')

    const [message, setMessage] =
        useState('')

    const userId =
        searchParams.get('userId')

    const token =
        searchParams.get('token')

    useEffect(() => {
        const validateToken =
            async () => {
                if (!userId || !token) {
                    setValidToken(false)
                    return
                }

                try {
                    const response =
                        await fetch(
                            `http://localhost:8080/users/${userId}/checkResetPasswordToken?token=${token}`
                        )

                    if (!response.ok) {
                        setValidToken(false)
                        return
                    }

                    const valid =
                        await response.json()

                    setValidToken(valid)
                } catch (error) {
                    console.error(error)

                    setValidToken(false)
                }
            }

        validateToken()
    }, [userId, token])

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault()

        if (!userId || !token) {
            return
        }

        setErrors({})
        setMessage('')

        const validationErrors: {
            newPassword?: string
            confirmPassword?: string
        } = {}

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
            const response =
                await fetch(
                    'http://localhost:8080/users/reset-password',
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify({
                            userId:
                                Number(userId),
                            token,
                            newPassword,
                        }),
                    }
                )

            if (!response.ok) {
                throw new Error(
                    'Password reset failed'
                )
            }

            setMessage(
                'Password successfully updated. Redirecting to login...'
            )

            setNewPassword('')
            setConfirmPassword('')

            setTimeout(() => {
                navigate('/login')
            }, 2000)


        } catch (error) {
            console.error(error)

            setMessage(
                'Unable to reset password.'
            )
        }
    }

    if (validToken === null) {
        return <h2>Loading...</h2>
    }

    if (!validToken) {
        return (
            <div className="invalid-token">
                <h1>
                    Invalid reset password
                    token
                </h1>
            </div>
        )
    }

    return (
        <div className="reset-password-page">
            <h1>Reset Password</h1>

            <form
                onSubmit={handleSubmit}
            >
                <label>
                    New Password *
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(
                            e.target.value
                        )

                        setErrors((prev) => ({
                            ...prev,
                            newPassword: undefined,
                        }))
                    }}
                    required
                />
                {errors.newPassword && (
                    <p className="field-error">
                        {errors.newPassword}
                    </p>
                )}

                <label>
                    Confirm Password *
                </label>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(
                            e.target.value
                        )

                        setErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                        }))
                    }}
                    required
                />

                <button type="submit">
                    Change Password
                </button>
            </form>

            {message && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default ResetPasswordPage