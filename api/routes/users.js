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
  new_merchant,
  checkMail,
  seedDatabase
} from "../controllers/usersController";

//Register
router.post("/users/register", register);

//Seed
router.post("/seedDatabase",seedDatabase)
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
// router.get("/users/tester", test)

//Receive payment
router.post("/users/register-as-merchant", new_merchant)

router.post("/users/check-email",checkMail)
export default router;
