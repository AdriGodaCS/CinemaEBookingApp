import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BookingPage from './pages/BookingPage'
import RootLayout from './layouts/RootLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />   
          <Route path="/booking" element={<BookingPage />} />      
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
