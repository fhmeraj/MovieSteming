import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTION = {
  method: 'get',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}

/**
 * MovieDetails Component
 * Shows detailed information about a movie including poster, title, rating, and overview
 * Fetches movie data from TMDB API and displays:
 * - Poster image with fallback for missing images
 * - Title, rating, release date, and runtime
 * - Movie overview/description
 * - Budget and revenue information
 * - Genres with styled badges
 * - Navigation back to movie list
 */
function MovieDetails() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch movie details when component loads
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Build API endpoint with movie ID
        const endpoint = `${API_BASE_URL}/movie/${movieId}`
        
        // Make API request with authentication headers
        const response = await fetch(endpoint, API_OPTION)
        
        // Check if request was successful
        if (!response.ok) {
          throw new Error('Failed to fetch movie details')
        }
        
        // Parse the JSON response
        const data = await response.json()
        setMovie(data)
      } catch (err) {
        // Log error and set error state
        console.error(`Error: ${err}`)
        setError('Failed to load movie details')
      } finally {
        // Stop loading spinner when done
        setIsLoading(false)
      }
    }

    // Execute fetch function
    fetchMovieDetails()
  }, [movieId])

  // Show loading message while fetching
  if (isLoading) {
    return (
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <p className="text-white text-center mt-10">Loading...</p>
        </div>
      </main>
    )
  }

  // Show error message if fetch failed
  if (error || !movie) {
    return (
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <div className="mt-10 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Back to Movies
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Build poster URL with fallback image
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/no-poster.png'

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        {/* Back Button - Navigate to movie list */}
        <button 
          onClick={() => navigate('/')}
          className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          ← Back to Movies
        </button>

        <div className="mt-10 max-w-4xl">
          {/* Poster and Basic Info Section */}
          <div className="flex gap-8 mb-8">
            {/* Movie Poster Image */}
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className="w-64 rounded-lg shadow-lg object-cover"
            />
            
            {/* Movie Title and Key Info */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
              
              {/* Rating Display */}
              <div className="flex items-center gap-2 mb-4">
                <img src="/star.svg" alt="Rating" className="w-6 h-6" />
                <span className="text-yellow-400 text-xl font-semibold">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10
                </span>
              </div>

              {/* Release Year */}
              <p className="text-gray-300 mb-4">
                Release Year: {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
              </p>

              {/* Runtime */}
              <p className="text-gray-300">
                Runtime: {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {movie.overview || 'No description available'}
            </p>
          </div>

          {/* Genres Section */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
              <div className="flex flex-wrap gap-3">
                {movie.genres.map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Budget and Revenue Section */}
          {(movie.budget > 0 || movie.revenue > 0) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <h2 className="text-2xl font-bold text-white col-span-full mb-2">Financial Info</h2>
              
              {movie.budget > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-indigo-600">
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Budget</p>
                  <p className="text-white text-2xl font-bold">
                    ${(movie.budget / 1000000).toFixed(1)}M
                  </p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-green-600">
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Revenue</p>
                  <p className="text-white text-2xl font-bold">
                    ${(movie.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default MovieDetails