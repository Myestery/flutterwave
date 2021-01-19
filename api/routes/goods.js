const config = require("../config");
const { Router } = require("express");

const router = Router();

// Initialize Controller
import {
  list,
  show,
  create,
  update,
  remove,
  buy
} from "../controllers/goodsController";

// Get All
router.get("/goods", list);

// Get One
router.get("/goods/:id", show);

// Create
router.post("/goods", config.isAuthenticated, create);

// Update
router.put("/goods/:id", config.isAuthenticated, update);

// Delete
router.delete("/goods/:id", config.isAuthenticated, remove);

// Buy some goods from cart
router.post("/goods/buy", config.isAuthenticated, buy);

export default router;
