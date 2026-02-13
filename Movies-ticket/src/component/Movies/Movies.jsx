import React, { useState, useEffect } from 'react';
import { getCombinedMovies } from '../../api-helpers/api-helpers';
import MovieItem from './MovieItem';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCombinedMovies()
      .then((data) => {
        setMovies(data.movies);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto mt-8 px-4">
      <div className="bg-[#900C3F] text-white w-full md:w-2/5 mx-auto p-4 text-center rounded-lg mb-8">
        <h2 className="text-3xl font-bold">All Movies</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Loading movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No movies available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          {movies.map((movie, index) => (
            <MovieItem
              key={movie._id || movie.id || index}
              id={movie._id || movie.id}
              title={movie.title}
              posterUrl={movie.fullPosterUrl || movie.posterUrl}
              releaseDate={movie.release_date || movie.releaseDate}
              source={movie.source} // 'tmdb' or 'database'
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;