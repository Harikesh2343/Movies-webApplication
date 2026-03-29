// FILE: movies-backend/routes/payment-routes.js

import express from "express";
import { 
  createPaymentOrder, 
  getRazorpayKey, 
  verifyPayment 
} from "../controllers/payment-controller.js";

const paymentRouter = express.Router();

// Create payment order
paymentRouter.post("/create-order", createPaymentOrder);

// Get Razorpay API key
paymentRouter.get("/get-key", getRazorpayKey);

// Verify payment
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;