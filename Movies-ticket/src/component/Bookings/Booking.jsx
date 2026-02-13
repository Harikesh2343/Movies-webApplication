import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMovieDetails, createMovieInDatabase, newBooking } from "../../api-helpers/api-helpers";
import axios from "axios";

const Booking = () => {
  const [movie, setMovie] = useState(null);
  const [dbMovieId, setDbMovieId] = useState(null);
  const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [preparingMovie, setPreparingMovie] = useState(false);
  const id = useParams().id;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');

  useEffect(() => {
    const loadMovie = async () => {
      if (source === 'database') {
        // Movie is already in database
        try {
          const res = await axios.get(`/movie/${id}`);
          if (res.data && res.data.movie) {
            setMovie({
              title: res.data.movie.title,
              overview: res.data.movie.description,
              poster_path: res.data.movie.posterUrl,
              release_date: res.data.movie.releaseDate,
              actors: res.data.movie.actors
            });
            setDbMovieId(id);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        // TMDB movie - need to fetch details and create in database
        try {
          const res = await getMovieDetails(id);
          if (res && res.movie) {
            setMovie(res.movie);
            
            // Auto-create in database for booking
            setPreparingMovie(true);
            const dbRes = await createMovieInDatabase(res.movie);
            setPreparingMovie(false);
            
            if (dbRes && dbRes.movie) {
              setDbMovieId(dbRes.movie._id);
            }
          }
        } catch (err) {
          console.log(err);
          setPreparingMovie(false);
        }
      }
    };

    loadMovie();
  }, [id, source]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!dbMovieId) {
      alert("Movie is not ready for booking. Please try again in a moment.");
      return;
    }
    
    setLoading(true);
    
    newBooking({ ...inputs, movie: dbMovieId })
      .then((res) => {
        console.log(res);
        setLoading(false);
        alert("Booking successful!");
        navigate("/user");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("Booking failed. Please try again.");
      });
  };

  const imageUrl = movie?.poster_path 
    ? (movie.poster_path.startsWith('http') 
        ? movie.poster_path 
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : 'https://via.placeholder.com/400x600';

  return (
    <div className="min-h-screen py-8 px-4">
      {movie && (
        <Fragment>
          <h1 className="text-4xl font-fantasy text-center py-6">
            Book Tickets of Movie: {movie.title}
          </h1>
          
          {preparingMovie && (
            <div className="text-center py-4">
              <p className="text-yellow-600 font-semibold">
                🎬 Preparing movie for booking...
              </p>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-center max-w-7xl mx-auto">
            {/* Movie Info Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start pt-6 md:pr-8">
              <img
                className="w-4/5 h-auto rounded-lg shadow-lg"
                src={imageUrl}
                alt={movie.title}
              />
              <div className="w-4/5 mt-6 p-4 bg-white rounded-lg shadow">
                <p className="pt-4 text-gray-700">{movie.overview}</p>
                {movie.vote_average && (
                  <p className="font-bold mt-4">
                    Rating: {movie.vote_average}/10
                  </p>
                )}
                {movie.actors && movie.actors.length > 0 && (
                  <p className="font-bold mt-4">
                    Starrer: {movie.actors.join(", ")}
                  </p>
                )}
                <p className="font-bold mt-2">
                  Release Date: {new Date(movie.release_date).toDateString()}
                </p>
              </div>
            </div>

            {/* Booking Form Section */}
            <div className="w-full md:w-1/2 pt-6">
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="p-8 bg-white rounded-lg shadow-lg space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seat Number
                    </label>
                    <input
                      value={inputs.seatNumber}
                      onChange={handleChange}
                      name="seatNumber"
                      type="number"
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Date
                    </label>
                    <input
                      value={inputs.date}
                      onChange={handleChange}
                      name="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || preparingMovie || !dbMovieId}
                    className={`w-full py-3 rounded-full font-medium mt-6 transition-colors ${
                      loading || preparingMovie || !dbMovieId
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                        : 'bg-[#2b2d42] text-white hover:bg-[#1f2130]'
                    }`}
                  >
                    {loading ? "Booking..." : preparingMovie ? "Preparing..." : "Book Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Booking;