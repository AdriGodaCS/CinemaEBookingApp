import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './VerifyAccountPage.css'

function VerifyAccountPage() {
  const [searchParams] =
    useSearchParams()

  const [message, setMessage] =
    useState('Verifying account...')

  useEffect(() => {
    const verifyAccount = async () => {
      const token =
        searchParams.get('token')

      if (!token) {
        setMessage(
          'Invalid verification token.'
        )
        return
      }

      try {
        const response =
          await fetch(
            `http://localhost:8080/users/verify?token=${token}`
          )

        const text =
          await response.text()

        if (!response.ok) {
          setMessage(text)
          return
        }

        setMessage(text)
      } catch (error) {
        console.error(error)

        setMessage(
          'Verification failed.'
        )
      }
    }

    verifyAccount()
  }, [searchParams])

  return (
    <div className="verification-page">
      <h1>{message}</h1>
    </div>
  )
}

export default VerifyAccountPage