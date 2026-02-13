import axios from "axios";

const API_KEY = "73462371f2b0e5db537278966fa1f9df";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Get all popular movies from TMDB
export const getAllMovies = async () => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`);
    
    if (res.status !== 200) {
      console.log("No data");
      return { movies: [] };
    }
    
    return { movies: res.data.results };
  } catch (err) {
    console.log(err);
    return { movies: [] };
  }
};

// Search movies by query
export const searchMovies = async (query) => {
  try {
    const res = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );
    
    if (res.status !== 200) {
      console.log("No data");
      return { movies: [] };
    }
    
    return { movies: res.data.results };
  } catch (err) {
    console.log(err);
    return { movies: [] };
  }
};

// Get movie details by ID with cast information
export const getMovieDetails = async (id) => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`);
    
    if (res.status !== 200) {
      console.log("Unexpected Error");
      return null;
    }
    
    // Extract top 5 actors from cast
    const actors = res.data.credits?.cast?.slice(0, 5).map(actor => actor.name) || [];
    
    return { 
      movie: {
        ...res.data,
        actors: actors
      }
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Create movie in database without admin auth
export const createMovieInDatabase = async (tmdbMovie) => {
  try {
    console.log("Creating movie in database:", tmdbMovie.title);
    
    // Check if movie already exists
    const allMovies = await axios.get("/movie");
    const existingMovie = allMovies.data.movies.find(
      m => m.title === tmdbMovie.title && 
           new Date(m.releaseDate).getFullYear() === new Date(tmdbMovie.release_date).getFullYear()
    );
    
    if (existingMovie) {
      console.log("Movie already exists in database");
      return { movie: existingMovie };
    }
    
    // Create movie data
    const movieData = {
      title: tmdbMovie.title,
      description: tmdbMovie.overview || "No description available",
      releaseDate: tmdbMovie.release_date || new Date().toISOString().split('T')[0],
      posterUrl: tmdbMovie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "https://via.placeholder.com/300x450",
      featured: false,
      actors: tmdbMovie.actors || []
    };
    
    // ✅ USE NEW ENDPOINT - No auth required
    const res = await axios.post("/movie/auto-create", movieData);
    
    if (res.status === 201 || res.status === 200) {
      console.log("✅ Movie created successfully");
      return res.data;
    }
    
    return null;
  } catch (err) {
    console.log("❌ Error creating movie:", err.response?.data || err.message);
    
    // Try to find it anyway
    try {
      const allMovies = await axios.get("/movie");
      const existingMovie = allMovies.data.movies.find(
        m => m.title === tmdbMovie.title
      );
      if (existingMovie) {
        console.log("Found existing movie");
        return { movie: existingMovie };
      }
    } catch (e) {
      console.log(e);
    }
    
    return null;
  }
};

//  Get combined movies (TMDB + Database)
export const getCombinedMovies = async () => {
  try {
    // Get TMDB movies
    const tmdbRes = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const tmdbMovies = tmdbRes.data.results.map(movie => ({
      ...movie,
      source: 'tmdb',
      _id: movie.id,
      fullPosterUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/300x450'
    }));
    
    // Get database movies (admin-added)
    const dbRes = await axios.get('/movie');
    const dbMovies = dbRes.data.movies.map(movie => ({
      ...movie,
      source: 'database',
      fullPosterUrl: movie.posterUrl,
      release_date: movie.releaseDate
    }));
    
    // Database movies first, then TMDB
    return {
      movies: [...dbMovies, ...tmdbMovies]
    };
  } catch (err) {
    console.log(err);
    return { movies: [] };
  }
};

// User authentication
export const sendUserAuthRequest = async (data, signup) => {
  try {
    const res = await axios.post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    });

    if (res.status !== 200 && res.status !== 201) {
      console.log("Unexpected Error Occurred");
      return null;
    }

    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Admin authentication
export const sendAdminAuthRequest = async (data, signup) => {
  try {
    const res = await axios.post(`/admin/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    });
    
    if (res.status !== 200 && res.status !== 201) {
      console.log("Unexpected Error");
      return null;
    }
    
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Create new booking
export const newBooking = async (data) => {
  try {
    const res = await axios.post("/booking", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      date: data.date,
      user: localStorage.getItem("userId")
    });

    if (res.status !== 201) {
      console.log("Unexpected Error");
      return null;
    }

    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Get user bookings
export const getUserBooking = async () => {
  const id = localStorage.getItem("userId");
  try {
    const res = await axios.get(`/user/bookings/${id}`);
    
    if (res.status !== 200) {
      console.log("Unexpected Error");
      return { bookings: [] };
    }
    
    return res.data;
  } catch (err) {
    console.log(err);
    return { bookings: [] };
  }
};

// Get user details
export const getUserDetails = async () => {
  const id = localStorage.getItem("userId");
  try {
    const res = await axios.get(`/user/${id}`);
    
    if (res.status !== 200) {
      console.log("Unexpected Error");
      return null;
    }
    
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Get admin bookings (all bookings)
export const getAdminBooking = async () => {
  try {
    const res = await axios.get("/booking");
    
    if (res.status !== 200) {
      console.log("Unexpected Error");
      return { bookings: [] };
    }
    
    return res.data;
  } catch (err) {
    console.log(err);
    return { bookings: [] };
  }
};

// Get admin details
export const getAdminDetails = async () => {
  const id = localStorage.getItem("adminId");
  try {
    const res = await axios.get(`/admin/${id}`);
    
    if (res.status !== 200) {
      console.log("Unexpected Error");
      return null;
    }
    
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Delete booking
export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`);
    
    if (res.status !== 200) {
      console.log("Unexpected Error");
      return null;
    }

    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Add movie (admin only)
export const addMovie = async (data) => {
  try {
    const res = await axios.post("/movie", {
      title: data.title,
      description: data.description,
      releaseDate: data.releaseDate,
      posterUrl: data.posterUrl,
      featured: data.featured,
      actors: data.actors,
      admin: localStorage.getItem("adminId")
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.status !== 201) {
      console.log("Unexpected Error");
      return null;
    }

    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};