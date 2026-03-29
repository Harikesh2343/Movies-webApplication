import express from "express";
import { getMovieById, getAllMovies, addMovie, autoCreateMovie } from "../controllers/movie-controller.js";

const movieRouter = express.Router();

movieRouter.post("/auto-create", autoCreateMovie);
movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", addMovie);

export default movieRouter;