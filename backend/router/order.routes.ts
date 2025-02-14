import express from "express";
import { createOrder, getOrders, confirmPayment } from "../controller/order.controller";

const router = express.Router();

// Create a new order
router.post("/create", createOrder as express.RequestHandler);

// Get all orders
router.get("/", getOrders as express.RequestHandler);

// Confirm payment for an order
router.post("/confirm-payment", confirmPayment as express.RequestHandler);

export default router;
