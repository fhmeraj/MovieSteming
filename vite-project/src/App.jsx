import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Shearch from './components/Shearch'
import Spinner from './components/Spinner'
import MoiveCard from './components/MoiveCard'
import MovieDetails from './components/MovieDetails'
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from '../appwrite'

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
// Configuration object for TMDB API requests with Bearer token authentication
const API_OPTION = {
  method: 'get',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}

/**
 * App Component
 * Main application component that manages the movie discovery interface.
 * Handles fetching movies from TMDB API, displaying them in a grid,
 * and managing loading and error states.
 */
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

  useDebounce( () => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

  /**
   * fetchMovies - Async function that fetches popular movies from TMDB API
   * - Sets loading state to true while fetching
   * - Clears previous error messages
   * - Makes API request to discover/movie endpoint sorted by popularity
   * - Handles errors and displays user-friendly error messages
   * - Updates movieList state with fetched data
   */

  const fetchMovies = async (query = '') => {

    // Set loading state and clear previous errors

    setIsLoading(true);
    setErrorMessage('');
    try{

      // Build API endpoint to fetch popular movies

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      
      // Make GET request to TMDB API with authentication
      const response = await fetch(endpoint, API_OPTION);
      
      // Check if response status is successful (200-299)
      if(!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
      }

      // Parse response JSON
      const data = await response.json();
      console.log(data);

      // Check if results array exists and has data
      if(data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      
      // Update movieList state with fetched results
      setMovieList(data.results || []);

      // updateSearchCount()
      if(query && data.results.length>0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      // Log error to console for debugging
      console.error(`Error fetching movies: ${error}`);
      // Set error message to display to user
      setErrorMessage('error fetching movies. Please try again later..')
    } finally{
      // Stop loading spinner regardless of success or failure
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async (query = '') => {
    try {
      const movie = await getTrendingMovies()
      setTrendingMovies(movie);

    } catch (error) {
      console.error(`error fetching trending movies: ${error}`);
    }
  }

  /**
   * useEffect hook - Runs once on component mount (empty dependency array)
   * Calls fetchMovies to load initial movie data when the app loads
   */
  useEffect(()=>{
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MovieList searchTerm={searchTerm} setSearchTerm={setSearchTerm} movieList={movieList} isLoading={isLoading} errorMessage={errorMessage} trendingMovies={trendingMovies} />} />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
    </Routes>
  )
}

/**
 * MovieList Component
 * Displays the list of movies with search functionality
 */
function MovieList({ searchTerm, setSearchTerm, movieList, isLoading, errorMessage, trendingMovies = [] }) {
  return (
   <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero" />
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Shearch searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies && trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movie</h2>
            <ul>{trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title}/> 
              </li>
            ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>ALL Movies</h2>

          {isLoading ? (<Spinner/>
          ): errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie) =>(
                <MoiveCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>    
   </main>
  )
}

export default App

