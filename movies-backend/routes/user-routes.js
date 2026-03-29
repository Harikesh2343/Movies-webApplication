import express from "express";
import {
  deleteUser,
  getAllUsers,
  getBookingsOfUser,
  signup,
  updateUser,
  login,
  getUserById,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);

// ✅ FIX 1: /bookings/:id MUST be declared before /:id
// Express matches routes top-to-bottom. If /:id comes first,
// a request to /bookings/abc matches /:id with id = "bookings".
userRouter.get("/bookings/:id", getBookingsOfUser);

userRouter.get("/:id", getUserById);
userRouter.post("/signup", signup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);

export default userRouter;