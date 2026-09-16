import { useState } from 'react';
import MovieList from '../components/MovieList'
import './Home.css'

function Home() {

    const [inputTitle, setInputTitle] = useState("");
    const [genre, setGenre] = useState("");

    return (
        <section className="home-page" aria-labelledby="home-title">
        <MovieList input={inputTitle} genre={genre}/>
        </section>
  )
}

export default Home
