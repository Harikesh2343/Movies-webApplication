import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Movie from "../models/Movie.js";
import Admin from "../models/Admin.js";

export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];

  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // Verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;

  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !posterUrl ||
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;

  try {
    movie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate),
      featured,
      actors,
      posterUrl,
      admin: adminId,
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();

    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Request failed" });
  }

  if (!movie) {
    return res.status(500).json({ message: "Request failed" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return res.status(500).json({ message: "Error fetching movies" });
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;

  try {
    movie = await Movie.findById(id).populate("bookings");
  } catch (err) {
    return res.status(500).json({ message: "Error fetching movie" });
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

export const autoCreateMovie = async (req, res, next) => {
  const { title, description, releaseDate, posterUrl, featured, actors } = req.body;

  if (!title || !description || !posterUrl) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    let adminUser = await Admin.findOne();
    if (!adminUser) {
      adminUser = new Admin({ email: "system@auto.com", password: "system_password" });
      await adminUser.save();
    }

    movie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate),
      featured: featured || false,
      actors: actors || [],
      posterUrl,
      admin: adminUser._id,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Auto-create request failed" });
  }

  return res.status(201).json({ movie });
};
