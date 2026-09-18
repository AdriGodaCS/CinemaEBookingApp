import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RootLayout from './layouts/RootLayout'
import { MovieDetails } from './pages/MovieDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie{id}" element={<MovieDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
