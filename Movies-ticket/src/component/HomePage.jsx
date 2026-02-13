import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCombinedMovies } from '../api-helpers/api-helpers';
import MovieItem from './Movies/MovieItem';

const HomePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getCombinedMovies()
      .then((data) => setMovies(data.movies))
      .catch(err => console.log(err));
  }, []);

  const featuredMovie = movies.find(m => m.featured) || movies[0];

  return (
    <div className="w-full min-h-screen mt-4 px-4">
      
      {featuredMovie && (
        <div className="max-w-6xl mx-auto h-96 p-4 mb-8">
          <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
            <img
              src={featuredMovie.fullPosterUrl || featuredMovie.posterUrl || 'https://via.placeholder.com/1920x1080'}
              alt="Featured Movie"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h2 className="text-white text-3xl font-bold mb-2">
                {featuredMovie.title}
              </h2>
              <p className="text-white text-sm line-clamp-2">
                {featuredMovie.overview || featuredMovie.description}
              </p>
              <Link
                to={`/booking/${featuredMovie._id || featuredMovie.id}?source=${featuredMovie.source}`}
                className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}

     
      <div className="py-8">
        <h2 className="text-4xl font-bold text-center mb-8">
          Latest Releases
        </h2>
      </div>

   
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Loading movies...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center max-w-[1400px] mx-auto mb-8">
            {movies.slice(0, 4).map((movie, index) => (
              <MovieItem
                id={movie._id || movie.id}
                title={movie.title}
                posterUrl={movie.fullPosterUrl || movie.posterUrl}
                releaseDate={movie.release_date || movie.releaseDate}
                source={movie.source}
                key={movie._id || movie.id || index}
              />
            ))}
          </div>

          <div className="flex justify-center py-8 mb-8">
            <Link
              to="/movies"
              className="px-8 py-3 border-2 border-[#2b2d42] text-[#2b2d42] rounded-full hover:bg-[#2b2d42] hover:text-white transition-colors font-medium"
            >
              View All Movies
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;