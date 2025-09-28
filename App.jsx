import React, { useState } from "react";

const API_KEY = "fcc8377c";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const searchMovies = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a movie name");
      setMovies([]);
      return;
    }
    setError("");
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch (e) {
      setError("Failed to fetch movies");
      setMovies([]);
    }
  };

  // Determine container class based on movies presence
  const containerClass = movies.length
    ? "container top-layout"
    : "container center-layout";

  return (
    <div className={containerClass}>
      <h1 className="title">Cinima Search</h1>
      <div className="search-area">
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          placeholder="Enter movie name..."
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies()}
        />
        <button className="search-button" onClick={searchMovies}>
          Search
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.Title}
                className="movie-poster"
              />
              <h2 className="movie-title">{movie.Title}</h2>
              <p className="movie-details">Year: {movie.Year}</p>
              <p className="movie-details">Type: {movie.Type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
