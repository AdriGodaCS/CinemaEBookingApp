import './AdminPage.css'

function AdminPage() {
  return (
    <div className="admin-page">
      <h1 className="admin-title">
        Admin Dashboard
      </h1>

      <div className="admin-menu">
        <button className="admin-card">
          Manage Movies
        </button>

        <button className="admin-card">
          Manage Promotions
        </button>

        <button className="admin-card">
          Manage Users
        </button>

        <button className="admin-card">
          Manage Showtimes
        </button>
      </div>
    </div>
  )
}

export default AdminPage