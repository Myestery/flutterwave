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
  registerAsMerchant,
  promptPayment,
  verifyTransaction
} from "../controllers/usersController";

//Register
router.post("/users/register", register);

//Register
router.post("/users/register-as-merchant", registerAsMerchant);

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

//Verify a transaction and save it to database
router.post("/users/verify-transaction", verifyTransaction)
export default router;
