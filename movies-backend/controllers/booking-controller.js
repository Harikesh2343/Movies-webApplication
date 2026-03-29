import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Bookings from "../models/Booking.js";

export const newBooking = async (req, res, next) => {
  const { movie, date,time, seatNumber, user } = req.body;
  

  if(!movie || !date || !time || !seatNumber || !user){
    return res.status(422).json({message : " All Fields are Required"}) ;
  }

  let existingMovie;
  let existingUser;
  
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return res.status(500).json({ message: "Error finding movie or user" });
  }
  
  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found by given ID" });
  }
  
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given id" });
  }

  try {
    const duplicate = await Bookings.findOne({
      movie,
      date,
      time,
      seatNumber: String(seatNumber),
    });

    if (duplicate) {
      return res.status(400).json({
        message: `Seat ${seatNumber} is already booked for this show`,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error checking existing bookings" });
  } 
  let booking;
  
  try {
    booking = new Bookings({
      movie,
      date,
      time,
      seatNumber : String(seatNumber),
      user
    });
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to create a booking" });
  }
  
  return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching booking" });
  }
  
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  
  try {
    booking = await Bookings.findByIdAndDelete(id).populate("user movie");
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to Delete" });
  }
  
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  
  return res.status(200).json({ message: "Successfully Deleted" });
};