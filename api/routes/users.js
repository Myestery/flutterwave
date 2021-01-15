// const config = require("../config");
const { Router } = require("express");
const router = Router();

// Initialize Controller
import {
  register,
  login,
  logout,
  user,
  getBanks,
  verifyBank,
  tester,
  promptPayment,
  verifyTransaction,
  receivePayment
} from "../controllers/usersController";

//Register
router.post("/users/register", register);

// Login
router.post("/users/login", login);

// Logout
router.post("/users/logout", logout);

// Get User
router.get("/users/user", user);

//Create a Virtual shop
router.get("/users/getBanks",getBanks)

//verify a bank exists
router.post("/users/verify-bank-details",verifyBank)

//tester
router.get("/users/tester", tester)

//Prompt payment and payment
router.post("/users/promptPayment", promptPayment)

//Receive payment
router.get("/receivePayment", receivePayment)

//Verify a transaction and save it to database
router.post("/users/verify-transaction", verifyTransaction)
export default router;
