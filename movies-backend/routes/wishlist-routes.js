import express from "express";
import {
  getUserWishlists,
  createWishlist,
  renameWishlist,
  deleteWishlist,
  addMovieToWishlist,
  removeMovieFromWishlist,
  getWishlistsContainingMovie,
} from "../controllers/wishlist-controller.js";

const wishlistRouter = express.Router();

// GET all wishlists for a user
wishlistRouter.get("/user/:userId", getUserWishlists);

// GET which wishlists contain a specific movie (for a user)
wishlistRouter.get("/user/:userId/movie/:movieId", getWishlistsContainingMovie);

// POST create a new wishlist
wishlistRouter.post("/", createWishlist);

// PUT rename a wishlist
wishlistRouter.put("/:id", renameWishlist);

// DELETE a wishlist
wishlistRouter.delete("/:id", deleteWishlist);

// POST add a movie to a wishlist
wishlistRouter.post("/:id/movies", addMovieToWishlist);

// DELETE remove a movie from a wishlist
wishlistRouter.delete("/:id/movies/:movieId", removeMovieFromWishlist);

export default wishlistRouter;