import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Booking from "../models/Booking.js"; // ← note: "Booking", no 's'

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return res.status(500).json({ message: "Error fetching users" });
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (
    !name || name.trim() === "" ||
    !email || email.trim() === "" ||
    !password || password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
  return res.status(201).json({ id: user._id });
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name || name.trim() === "" ||
    !email || email.trim() === "" ||
    !password || password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Updated successfully" });
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    return res.status(500).json({ message: "Error deleting user" });
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Invalid inputs" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: "Error finding user" });
  }
  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Unable to find user by this email" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  return res
    .status(200)
    .json({ message: "Login Successful", id: existingUser._id });
};

// ✅ FIX 2: was `Bookings.find()` — model import is `Booking` (no 's')
// Using the wrong name throws ReferenceError → 500 → empty bookings array
export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Booking.find({ user: id }).populate("movie");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bookings" });
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to find Bookings" });
  }
  return res.status(200).json({ bookings });
};

// ✅ FIX 3: was returning { users } — frontend reads res.user (singular)
// getUserDetails() in api-helpers returns res.data, and UserProfile
// does setUser(res.user), so the key must be "user" not "users"
export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching user" });
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
  // ✅ key is "user" (singular) — matches what the frontend expects
  return res.status(200).json({ user });
};