// FILE: Movies-ticket/src/api-helpers/api-helpers.js (UPDATED - Shows 150+ movies)

import axios from "axios";

const API_KEY = "73462371f2b0e5db537278966fa1f9df";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const getAllMovies = async () => {
  try {
    const totalPages = 18; 
    const allMovies = [];

    // Fetch 8 pages in parallel for speed
    const promises = [];
    for (let page = 1; page <= totalPages; page++) {
      promises.push(
        axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`)
      );
    }

    const responses = await Promise.all(promises);
    
    // Combine all results
    responses.forEach(res => {
      if (res.status === 200 && res.data.results) {
        allMovies.push(...res.data.results);
      }
    });

    console.log(`✅ Loaded ${allMovies.length} movies from TMDB`);
    return { movies: allMovies };
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


export const getCombinedMovies = async (page = 1) => {
  try {
  
    const res = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );

    const tmdbMovies = res.data.results.map(movie => ({
      ...movie,
      source: 'tmdb',
      _id: movie.id,
      fullPosterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/300x450'
    }));

    // 🔹 Fetch DB movies ONLY on first page
    let dbMovies = [];
    if (page === 1) {
      const dbRes = await axios.get('/movie');
      dbMovies = dbRes.data.movies.map(movie => ({
        ...movie,
        source: 'database',
        fullPosterUrl: movie.posterUrl,
        release_date: movie.releaseDate
      }));
    }

    console.log(`✅ Page ${page} loaded`);

    return {
      movies: page === 1 ? [...dbMovies, ...tmdbMovies] : tmdbMovies,
      hasMore: page < res.data.total_pages
    };

  } catch (err) {
    console.log(err);
    return { movies: [], hasMore: false };
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
      time : data.time,
      user: localStorage.getItem("userId")
    });

    if (res.status !== 201) {
      console.log("Unexpected Error");
      return null;
    }

    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Booking failed";
    throw new Error(message);
    
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
// This is already correct in your latest api-helpers.js — no change needed
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



// GET all wishlists for the logged-in user
export const getUserWishlists = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return { wishlists: [] };
 
  try {
    const res = await axios.get(`/wishlist/user/${userId}`);
    if (res.status !== 200) return { wishlists: [] };
    return res.data;
  } catch (err) {
    console.log(err);
    return { wishlists: [] };
  }
};
 
// GET which wishlists (for the current user) already contain a given movie
export const getWishlistsContainingMovie = async (movieId) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return { wishlists: [] };
 
  try {
    const res = await axios.get(`/wishlist/user/${userId}/movie/${movieId}`);
    if (res.status !== 200) return { wishlists: [] };
    return res.data;
  } catch (err) {
    console.log(err);
    return { wishlists: [] };
  }
};
 
// POST create a new wishlist
export const createWishlist = async (name) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return null;
 
  try {
    const res = await axios.post("/wishlist", { name, userId });
    if (res.status !== 201) return null;
    return res.data; // { wishlist }
  } catch (err) {
    // Propagate error message so the UI can display it
    const message =
      err.response?.data?.message || "Error creating wishlist";
    throw new Error(message);
  }
};
 
// PUT rename a wishlist
export const renameWishlist = async (wishlistId, newName) => {
  const userId = localStorage.getItem("userId");
 
  try {
    const res = await axios.put(`/wishlist/${wishlistId}`, {
      name: newName,
      userId,
    });
    if (res.status !== 200) return null;
    return res.data; // { wishlist }
  } catch (err) {
    const message =
      err.response?.data?.message || "Error renaming wishlist";
    throw new Error(message);
  }
};
 
// DELETE a wishlist
export const deleteWishlist = async (wishlistId) => {
  try {
    const res = await axios.delete(`/wishlist/${wishlistId}`);
    if (res.status !== 200) return null;
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
 
// POST add a movie to a specific wishlist
export const addMovieToWishlist = async (wishlistId, movieData) => {
  try {
    const res = await axios.post(`/wishlist/${wishlistId}/movies`, movieData);
    if (res.status !== 200) return null;
    return res.data; // { wishlist }
  } catch (err) {
    const message =
      err.response?.data?.message || "Error adding movie to wishlist";
    throw new Error(message);
  }
};
 
// DELETE remove a movie from a wishlist
export const removeMovieFromWishlist = async (wishlistId, movieId) => {
  try {
    const res = await axios.delete(
      `/wishlist/${wishlistId}/movies/${movieId}`
    );
    if (res.status !== 200) return null;
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
 