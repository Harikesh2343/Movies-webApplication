import mongoose from "mongoose";

const wishlistMovieSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    default: "https://via.placeholder.com/300x450?text=No+Poster",
  },
  source: {
    type: String,
    enum: ["tmdb", "database"],
    default: "tmdb",
  },
  releaseDate: {
    type: String,
    default: "",
  },
  voteAverage: {
    type: Number,
    default: null,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const wishlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movies: [wishlistMovieSchema],
  },
  { timestamps: true }
);

// Compound index: one user cannot have two wishlists with the same name
wishlistSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);