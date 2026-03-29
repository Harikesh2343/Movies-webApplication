import Wishlist from "../models/Wishlist.js";

// ─── GET all wishlists for a user ────────────────────────────────────────────
export const getUserWishlists = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlists = await Wishlist.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ wishlists });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching wishlists" });
  }
};

// ─── CREATE a new wishlist ────────────────────────────────────────────────────
export const createWishlist = async (req, res) => {
  const { name, userId } = req.body;

  if (!name || name.trim() === "") {
    return res.status(422).json({ message: "Wishlist name cannot be empty" });
  }

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const existing = await Wishlist.findOne({
      user: userId,
      name: name.trim(),
    });

    if (existing) {
      return res.status(400).json({
        message: `A wishlist named "${name.trim()}" already exists`,
      });
    }

    const wishlist = new Wishlist({ name: name.trim(), user: userId, movies: [] });
    await wishlist.save();

    return res.status(201).json({ wishlist });
  } catch (err) {
    // Duplicate key from index
    if (err.code === 11000) {
      return res.status(400).json({ message: "Wishlist name already exists" });
    }
    console.log(err);
    return res.status(500).json({ message: "Error creating wishlist" });
  }
};

// ─── RENAME a wishlist ────────────────────────────────────────────────────────
export const renameWishlist = async (req, res) => {
  const { id } = req.params;
  const { name, userId } = req.body;

  if (!name || name.trim() === "") {
    return res.status(422).json({ message: "Wishlist name cannot be empty" });
  }

  try {
    // Check for duplicate name on same user (excluding current)
    const duplicate = await Wishlist.findOne({
      user: userId,
      name: name.trim(),
      _id: { $ne: id },
    });

    if (duplicate) {
      return res.status(400).json({
        message: `A wishlist named "${name.trim()}" already exists`,
      });
    }

    const wishlist = await Wishlist.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.status(200).json({ wishlist });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error renaming wishlist" });
  }
};

// ─── DELETE a wishlist ────────────────────────────────────────────────────────
export const deleteWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    const wishlist = await Wishlist.findByIdAndDelete(id);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.status(200).json({ message: "Wishlist deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting wishlist" });
  }
};

// ─── ADD a movie to a wishlist ────────────────────────────────────────────────
export const addMovieToWishlist = async (req, res) => {
  const { id } = req.params; // wishlist id
  const { movieId, title, posterUrl, source, releaseDate, voteAverage } = req.body;

  if (!movieId || !title) {
    return res.status(422).json({ message: "movieId and title are required" });
  }

  try {
    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Prevent duplicate
    const alreadyExists = wishlist.movies.some(
      (m) => String(m.movieId) === String(movieId)
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: `"${title}" is already in this wishlist`,
      });
    }

    wishlist.movies.push({
      movieId: String(movieId),
      title,
      posterUrl: posterUrl || "https://via.placeholder.com/300x450?text=No+Poster",
      source: source || "tmdb",
      releaseDate: releaseDate || "",
      voteAverage: voteAverage || null,
    });

    await wishlist.save();

    return res.status(200).json({ wishlist });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error adding movie to wishlist" });
  }
};

// ─── REMOVE a movie from a wishlist ──────────────────────────────────────────
export const removeMovieFromWishlist = async (req, res) => {
  const { id, movieId } = req.params;

  try {
    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const before = wishlist.movies.length;
    wishlist.movies = wishlist.movies.filter(
      (m) => String(m.movieId) !== String(movieId)
    );

    if (wishlist.movies.length === before) {
      return res.status(404).json({ message: "Movie not found in wishlist" });
    }

    await wishlist.save();

    return res.status(200).json({ wishlist });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error removing movie from wishlist" });
  }
};

// ─── CHECK which wishlists contain a specific movie ───────────────────────────
export const getWishlistsContainingMovie = async (req, res) => {
  const { userId, movieId } = req.params;

  try {
    const wishlists = await Wishlist.find({
      user: userId,
      "movies.movieId": String(movieId),
    }).select("_id name");

    return res.status(200).json({ wishlists });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error checking wishlists" });
  }
};