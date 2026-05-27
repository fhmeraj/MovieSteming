import { useLocation, useNavigate } from 'react-router-dom'

/**
 * MovieDetails Component
 * Displays detailed information about a selected movie.
 * Receives movie data passed from MoiveCard (no API call needed).
 * Shows: poster, title, rating, release date, and language.
 */
function MovieDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get movie data passed from MoiveCard
  const movieData = location.state?.movie

  // Handle if no data is passed
  if (!movieData) {
    return (
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <div className="mt-10 text-center">
            <p className="text-red-500 mb-4">Movie not found</p>
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

  // Destructure movie data
  const { title, poster_path, vote_average, release_date, original_language } = movieData

  // Build poster URL with fallback
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : '/no-poster.png'

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          ← Back to Movies
        </button>

        <div className="mt-10 max-w-4xl">
          {/* Poster and Basic Info */}
          <div className="flex gap-8 mb-8">
            {/* Movie Poster */}
            <img 
              src={posterUrl} 
              alt={title} 
              className="w-64 rounded-lg shadow-lg object-cover"
            />
            
            {/* Movie Details */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <img src="/star.svg" alt="Rating" className="w-6 h-6" />
                <span className="text-yellow-400 text-xl font-semibold">
                  {vote_average ? vote_average.toFixed(1) : 'N/A'} / 10
                </span>
              </div>

              {/* Release Year */}
              <p className="text-gray-300 mb-4">
                Release Year: {release_date ? release_date.split('-')[0] : 'N/A'}
              </p>

              {/* Language */}
              <p className="text-gray-300">
                Language: {original_language ? original_language.toUpperCase() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MovieDetails
