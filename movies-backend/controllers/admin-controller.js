import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const addAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Invalid inputs" });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: "Error checking admin" });
  }

  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  let admin;
  try {
    admin = new Admin({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to store admin" });
  }

  const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return res.status(201).json({ admin, token, id: admin._id });
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Invalid inputs" });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: "Error finding admin" });
  }

  if (!existingAdmin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  // BUG FIX: removed "|| existingAdmin.password !== password"
  // That was comparing plain text to a hash which is always wrong
  const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return res.status(200).json({
    message: "Authentication Complete",
    token,
    id: existingAdmin._id,
  });
};

export const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find();
  } catch (err) {
    return res.status(500).json({ message: "Error fetching admins" });
  }

  if (!admins) {
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(200).json({ admins });
};

// BUG FIX: was "id.params.id" → "req.params.id"
// BUG FIX: typo "addedMOvies" → "addedMovies"
// BUG FIX: renamed to getAdminById to match router import
export const getAdminById = async (req, res, next) => {
  const id = req.params.id;           // was "id.params.id" — crashed immediately
  let admin;
  try {
    admin = await Admin.findById(id).populate("addedMovies"); // was "addedMOvies"
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching admin" });
  }

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  return res.status(200).json({ admin });
};