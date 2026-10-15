import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BookingPage from './pages/BookingPage'
import ProfilePage from './pages/ProfilePage'
import VerifyAccountPage from './pages/VerifyAccountPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AdminPage from './pages/AdminPage'
import RootLayout from './layouts/RootLayout'
import { MovieDetails } from './pages/MovieDetails'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movie/:movie_id/booking/:show_id" element={<BookingPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Route>
        <Route
          path="/verify-account"
          element={<VerifyAccountPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
