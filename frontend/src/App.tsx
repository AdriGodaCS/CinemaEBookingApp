import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BookingPage from './pages/BookingPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
import VerifyAccountPage from './pages/VerifyAccountPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AdminPage from './pages/AdminPage'
import RootLayout from './layouts/RootLayout'
import { MovieDetails } from './pages/MovieDetails'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { BookingProvider } from './context/BookingContext'

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/movie/:movie_id/booking/:show_id" element={<BookingPage />} />
            <Route path ="/checkout" element={<ProtectedRoute> <CheckoutPage /></ProtectedRoute>} />
            <Route path ="/payment" element={<ProtectedRoute> <PaymentPage /></ProtectedRoute>} />
            <Route // Route to ProtectedRoute proxy before going to ProfilePage
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
          <Route path="/signup" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          <Route
            path="/verifyaccount"
            element={<VerifyAccountPage />}
          />

          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
          />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  )
}

export default App
