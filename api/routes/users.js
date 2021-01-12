// const config = require("../config");
const { Router } = require("express");
const router = Router();

// Initialize Controller
import {
  register,
  login,
  logout,
  user,
  edit,
  upload,
  createShop,
  getBanks,
  verifyBank,
  tester
} from "../controllers/usersController";

//Register
router.post("/users/register", register);

// Login
router.post("/users/login", login);

// Logout
router.post("/users/logout", logout);

// Get User
router.get("/users/user", user);

//Edit User
router.put("/users/edit", upload, edit);

//Create a Virtual shop
router.post("/users/createShop", createShop)

//Create a Virtual shop
router.get("/users/getBanks",getBanks)

//verify a bank exists
router.post("/users/verify-bank-details",verifyBank)

//tester
router.get("/users/tester",tester)

export default router;
