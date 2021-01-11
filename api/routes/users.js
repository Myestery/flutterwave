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
  createShop
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
router.post("/users/createShop",createShop)

export default router;
