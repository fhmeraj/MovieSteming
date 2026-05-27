import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * MoiveCard Component
 * Displays a single movie card with poster image and movie details.
 * Clickable card that passes movie data to the details page.
 * Accepts a movie object with destructured properties:
 * - title: Movie title
 * - poster_path: URL path for movie poster
 * - vote_average: IMDb rating (0-10)
 * - release_date: Movie release date (YYYY-MM-DD format)
 * - original_language: Language code of the movie
 * - id: Movie ID used for navigation
 */
const MoiveCard = ({ movie: 
  {id, title, poster_path, vote_average, release_date, original_language} }) =>{
  const navigate = useNavigate()

  // Handle click - pass movie data to details page
  const handleClick = () => {
    navigate(`/movie/${id}`, {
      state: {
        movie: {
          id,
          title,
          poster_path,
          vote_average,
          release_date,
          original_language
        }
      }
    })
  }

  return (
    <div onClick={handleClick} className="movie-card-link">
      <div className='movie-card cursor-pointer hover:shadow-lg hover:scale-105 transition-transform'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}`: '/no-poster.png'} alt={title} />
        

        <div className='mt-4'>
          <h3 className='text-white'>{title}</h3>

          <div className='content'>
            <div className='rating'>
              <img src="/star.svg"/>
              <p className='mt-0.75'>{vote_average ? vote_average.toFixed(1) : 'N/a'}</p>
              <span>•</span>
              <p className='lang'>{original_language}</p>
              <span>•</span>
              <p className='year'>{release_date ? release_date.split('-')[0] : 'N/a'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MoiveCard