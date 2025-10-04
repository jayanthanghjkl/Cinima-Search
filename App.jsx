import React, { useState } from "react";

const API_KEY = "fcc8377c";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const fetchMovieDetails = async (imdbID) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setMovieDetails(data);
      }
    } catch (e) {
      console.error("Failed to fetch movie details");
    }
    setLoadingDetails(false);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setMovieDetails(null);
    fetchMovieDetails(movie.imdbID);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

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
            <div
              key={movie.imdbID}
              className="movie-card"
              onClick={() => handleMovieClick(movie)}
              style={{ cursor: "pointer" }}
            >
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

      {selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            {loadingDetails ? (
              <div className="loading">Loading details...</div>
            ) : movieDetails ? (
              <div className="details-container">
                <div className="details-header">
                  <img
                    src={
                      movieDetails.Poster !== "N/A"
                        ? movieDetails.Poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={movieDetails.Title}
                    className="details-poster"
                  />
                  <div className="details-info">
                    <h2 className="details-title">{movieDetails.Title}</h2>
                    <p className="details-year">{movieDetails.Year}</p>
                    <p className="details-rating">
                      ⭐ {movieDetails.imdbRating}/10
                    </p>
                    <p className="details-meta">
                      {movieDetails.Runtime} | {movieDetails.Genre}
                    </p>
                    <p className="details-meta">
                      Rated: {movieDetails.Rated}
                    </p>
                  </div>
                </div>
                <div className="details-section">
                  <h3>Plot</h3>
                  <p>{movieDetails.Plot}</p>
                </div>
                <div className="details-section">
                  <h3>Cast & Crew</h3>
                  <p><strong>Director:</strong> {movieDetails.Director}</p>
                  <p><strong>Writer:</strong> {movieDetails.Writer}</p>
                  <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                </div>
                {movieDetails.Awards !== "N/A" && (
                  <div className="details-section">
                    <h3>Awards</h3>
                    <p>{movieDetails.Awards}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
