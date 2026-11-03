import { useState } from 'react'
import AddMovieForm from '../components/AddMovieForm'
import './AdminPage.css'

function AdminPage() {
  const [
    viewMode,
    setViewMode,
  ] = useState('')

  return (
    <div className="admin-page">
      <h1 className="admin-title">
        Admin Dashboard
      </h1>

      <div className="admin-menu">
        <button
          className="admin-card"
          onClick={() =>
            setViewMode("movie")
          }
        >
          Manage Movies
        </button>

        <button
          className="admin-card"
          onClick={() =>
            setViewMode("promotion")
          }
        >
          Manage Promotions
        </button>

        <button
          className="admin-card"
          onClick={() =>
            setViewMode("user")
          }
        >
          Manage Users
        </button>

        <button
          className="admin-card"
          onClick={() =>
            setViewMode("showtime")
          }
        >
          Manage Showtimes
        </button>
      </div>

      {viewMode === "movie" && (
        <AddMovieForm />
      )}
    </div>
  )
}

export default AdminPage