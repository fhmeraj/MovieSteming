import React from 'react'

/**
 * Shearch Component (Search Component)
 * Renders a search input field for filtering movies by search term.
 * Props:
 * - searchTerm: Current search input value (string)
 * - setSearchTerm: Callback function to update search term in parent component
 */
const Shearch = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" />
        <input type='text'
          placeholder='Search for a movie...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
      </div>
      
    </div>
  )
}

export default Shearch
